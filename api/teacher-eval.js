// api/teacher-eval.js - Vercel Serverless Function
const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join('/tmp', 'classroom_students.json');
global.studentsDB = global.studentsDB || {};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { classKey, studentKey, scorePresentasi, catatanGuru } = req.body || {};
    if (!classKey || !studentKey) {
        return res.status(400).json({ error: 'Missing classKey or studentKey' });
    }

    if (!global.studentsDB[classKey]) {
        global.studentsDB[classKey] = {};
    }
    if (!global.studentsDB[classKey][studentKey]) {
        global.studentsDB[classKey][studentKey] = {
            identitas: { classKey, nama: studentKey, absen: 1 },
            status: { isOnline: false },
            nilai: { digitalScore: 0 }
        };
    }

    global.studentsDB[classKey][studentKey].teacherEvaluation = {
        scorePresentasi: parseInt(scorePresentasi, 10) || 0,
        catatanGuru: catatanGuru || '',
        updatedAt: new Date().toISOString()
    };

    try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(global.studentsDB), 'utf8');
    } catch (e) {}

    return res.status(200).json({ success: true });
};
