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

    const { classKey, studentKey, scorePresentasi, scoreLkpd, catatanGuru } = req.body || {};
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

    if (scorePresentasi !== undefined) {
        if (!global.studentsDB[classKey][studentKey].teacherEvaluation) {
            global.studentsDB[classKey][studentKey].teacherEvaluation = {};
        }
        global.studentsDB[classKey][studentKey].teacherEvaluation.scorePresentasi = parseInt(scorePresentasi, 10) || 0;
        global.studentsDB[classKey][studentKey].teacherEvaluation.catatanGuru = catatanGuru || '';
        global.studentsDB[classKey][studentKey].teacherEvaluation.updatedAt = new Date().toISOString();
    }

    if (scoreLkpd !== undefined) {
        const numScore = parseInt(scoreLkpd, 10) || 0;
        const s = global.studentsDB[classKey][studentKey];
        if (!s.nilai) s.nilai = {};
        if (!s.nilai.lkpdKelompok) s.nilai.lkpdKelompok = {};
        s.nilai.lkpdKelompok.teacherScore = numScore;
        s.nilai.lkpdKelompok.score = numScore;
        s.nilai.lkpdKelompok.bestScore = numScore;

        const indiv = (s.nilai.tugasIndividu && s.nilai.tugasIndividu.bestScore) || 0;
        const ev = (s.nilai.evaluasiAkhir && s.nilai.evaluasiAkhir.score) || 0;
        const bonus = s.nilai.bonusMiniLab || 0;
        s.nilai.digitalScore = Math.min(100, Math.round((indiv * 0.3) + (numScore * 0.35) + (ev * 0.35) + bonus));
    }

    try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(global.studentsDB), 'utf8');
    } catch (e) {}

    return res.status(200).json({ success: true });
};
