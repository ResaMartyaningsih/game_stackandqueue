// api/sync.js - Vercel Serverless Function
const https = require('https');
const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join('/tmp', 'classroom_students.json');
global.studentsDB = global.studentsDB || {};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const payload = req.body;
    if (!payload || !payload.identitas) {
        return res.status(400).json({ error: 'Payload tidak valid' });
    }

    const cls = payload.identitas.classKey || 'X-1';
    const absen = String(payload.identitas.absen || 0).padStart(2, '0');
    const nameSlug = (payload.identitas.nama || 'siswa')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 25);
    const studentKey = `absen_${absen}_${nameSlug}`;

    if (!global.studentsDB[cls]) {
        global.studentsDB[cls] = {};
    }

    const existing = global.studentsDB[cls][studentKey] || {};
    const teacherEval = existing.teacherEvaluation || payload.teacherEvaluation || {};

    global.studentsDB[cls][studentKey] = {
        ...payload,
        teacherEvaluation: teacherEval,
        _serverUpdated: new Date().toISOString()
    };

    try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(global.studentsDB), 'utf8');
    } catch (e) {}

    // Forward ke HTTPS Cloud Relay ntfy.sh
    try {
        const bodyStr = JSON.stringify(global.studentsDB[cls][studentKey]);
        const forwardReq = https.request('https://ntfy.sh/laraslogika_edu_pbl_v1', {
            method: 'POST',
            headers: {
                'Title': `${cls}_${studentKey}`,
                'Tags': 'student_sync',
                'Content-Length': Buffer.byteLength(bodyStr)
            }
        });
        forwardReq.on('error', () => {});
        forwardReq.setTimeout(1500, () => forwardReq.destroy());
        forwardReq.write(bodyStr);
        forwardReq.end();
    } catch (e) {}

    return res.status(200).json({ success: true, key: studentKey });
};
