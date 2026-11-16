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

    // Cari key yang cocok berdasarkan nama/slug atau nomor absen
    let targetKey = studentKey;
    const existingKeys = Object.keys(global.studentsDB[cls]);
    const matchedKey = existingKeys.find(k => {
        if (k === studentKey) return true;
        const st = global.studentsDB[cls][k];
        if (st && st.identitas && Number(st.identitas.absen) === Number(payload.identitas.absen)) {
            return true;
        }
        return false;
    });
    if (matchedKey) targetKey = matchedKey;

    const existing = global.studentsDB[cls][targetKey] || {};
    const teacherEval = existing.teacherEvaluation || payload.teacherEvaluation || {};

    let finalNilai = { ...(existing.nilai || {}), ...(payload.nilai || {}) };

    // Cek apakah ada skor LKPD baru dari siswa
    const inLkScore = (payload.nilai?.lkpdKelompok && (
        typeof payload.nilai.lkpdKelompok.autoScore === 'number' ? payload.nilai.lkpdKelompok.autoScore :
        (typeof payload.nilai.lkpdKelompok.score === 'number' ? payload.nilai.lkpdKelompok.score : (payload.nilai.lkpdKelompok.bestScore || 0))
    )) || 0;

    if (inLkScore > 0) {
        finalNilai.lkpdKelompok = {
            ...(existing.nilai?.lkpdKelompok || {}),
            ...(payload.nilai?.lkpdKelompok || {}),
            autoScore: inLkScore,
            score: inLkScore,
            bestScore: inLkScore,
            isLocked: true
        };
    } else if (existing.nilai?.lkpdKelompok) {
        finalNilai.lkpdKelompok = existing.nilai.lkpdKelompok;
    }

    // Hitung ulang digitalScore jika ada komponen yang lebih tinggi
    const curIndiv = Math.max(existing.nilai?.tugasIndividu?.bestScore || 0, payload.nilai?.tugasIndividu?.bestScore || 0);
    const curLkpd = (typeof finalNilai.lkpdKelompok?.autoScore === 'number' && finalNilai.lkpdKelompok.autoScore > 0)
        ? finalNilai.lkpdKelompok.autoScore
        : ((typeof finalNilai.lkpdKelompok?.teacherScore === 'number' && finalNilai.lkpdKelompok.teacherScore > 0) ? finalNilai.lkpdKelompok.teacherScore : 0);
    const curEval = Math.max(existing.nilai?.evaluasiAkhir?.score || 0, payload.nilai?.evaluasiAkhir?.score || 0);
    const curBonus = Math.max(existing.nilai?.bonusMiniLab || 0, payload.nilai?.bonusMiniLab || 0);

    const newComputedNd = Math.min(100, Math.round((curIndiv * 0.3) + (curLkpd * 0.35) + (curEval * 0.35) + curBonus));
    finalNilai.digitalScore = Math.max(existing.nilai?.digitalScore || 0, newComputedNd);

    global.studentsDB[cls][targetKey] = {
        ...existing,
        ...payload,
        identitas: { ...(existing.identitas || {}), ...(payload.identitas || {}) },
        nilai: finalNilai,
        teacherEvaluation: teacherEval,
        _serverUpdated: new Date().toISOString()
    };

    try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(global.studentsDB), 'utf8');
    } catch (e) {}

    // Forward ke HTTPS Cloud Relay ntfy.sh
    try {
        const bodyStr = JSON.stringify(global.studentsDB[cls][targetKey]);
        const forwardReq = https.request('https://ntfy.sh/laraslogika_edu_pbl_v1', {
            method: 'POST',
            headers: {
                'Title': `${cls}_${targetKey}`,
                'Tags': 'student_sync',
                'Content-Length': Buffer.byteLength(bodyStr)
            }
        });
        forwardReq.on('error', () => {});
        forwardReq.setTimeout(1500, () => forwardReq.destroy());
        forwardReq.write(bodyStr);
        forwardReq.end();
    } catch (e) {}

    return res.status(200).json({ success: true, key: targetKey });
};
