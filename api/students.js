// api/students.js - Vercel Serverless Function
const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join('/tmp', 'classroom_students.json');
global.studentsDB = global.studentsDB || {};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        if (fs.existsSync(TMP_FILE)) {
            const raw = fs.readFileSync(TMP_FILE, 'utf8');
            if (raw) {
                const parsed = JSON.parse(raw);
                global.studentsDB = { ...global.studentsDB, ...parsed };
            }
        }
    } catch (e) {}

    return res.status(200).json(global.studentsDB || {});
};
