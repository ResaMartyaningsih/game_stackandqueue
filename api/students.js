// api/students.js - Vercel Serverless Function
const https = require('https');
const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join('/tmp', 'classroom_students.json');
global.studentsDB = global.studentsDB || {};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // 1. Baca dari file lokal /tmp jika ada
    try {
        if (fs.existsSync(TMP_FILE)) {
            const raw = fs.readFileSync(TMP_FILE, 'utf8');
            if (raw) {
                const parsed = JSON.parse(raw);
                global.studentsDB = { ...global.studentsDB, ...parsed };
            }
        }
    } catch (e) {}

    // 2. Tarik cache dari Cloud Relay (ntfy.sh) agar data lintas instance selalu ada
    try {
        await new Promise((resolve) => {
            const reqRelay = https.get('https://ntfy.sh/laraslogika_edu_pbl_v1/json?poll=1&since=12h', (r) => {
                let text = '';
                r.on('data', chunk => text += chunk);
                r.on('end', () => {
                    const lines = text.trim().split('\n');
                    lines.forEach(line => {
                        try {
                            const parsed = JSON.parse(line);
                            if (parsed && parsed.event === 'message' && parsed.message) {
                                const s = JSON.parse(parsed.message);
                                if (s && s.identitas) {
                                    const cls = s.identitas.classKey || 'X-1';
                                    const abs = String(s.identitas.absen || 0).padStart(2, '0');
                                    const slug = (s.identitas.nama || 'siswa').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25);
                                    const sk = `absen_${abs}_${slug}`;
                                    if (!global.studentsDB[cls]) global.studentsDB[cls] = {};
                                    global.studentsDB[cls][sk] = s;
                                }
                            }
                        } catch (err) {}
                    });
                    resolve();
                });
            });
            reqRelay.on('error', () => resolve());
            reqRelay.setTimeout(1800, () => { reqRelay.destroy(); resolve(); });
        });
    } catch (e) {}

    return res.status(200).json(global.studentsDB || {});
};
