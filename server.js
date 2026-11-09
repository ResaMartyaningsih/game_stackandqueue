const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'classroom_students.json');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

// Load persisted database on startup
let localStudentsDatabase = {};
try {
    if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        if (raw) localStudentsDatabase = JSON.parse(raw);
        console.log(`📁 [DATABASE] Memuat data tersimpan dari ${DATA_FILE}`);
    }
} catch (e) {
    console.warn('Gagal membaca data/classroom_students.json, menginisialisasi kosong:', e);
}

function persistLocalDatabase() {
    try {
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(localStudentsDatabase, null, 2), 'utf8');
    } catch (e) {
        console.warn('Gagal menyimpan ke data/classroom_students.json:', e);
    }
}

// Helper: Get Primary Local IPv4 Address
function getLocalNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

function parseJsonBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
        // 1MB safety limit
        if (body.length > 1e6) {
            req.destroy();
        }
    });
    req.on('end', () => {
        try {
            const parsed = body ? JSON.parse(body) : {};
            callback(null, parsed);
        } catch (e) {
            callback(e, null);
        }
    });
}

const server = http.createServer((req, res) => {
    // Enable CORS for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // -------------------------------------------------------------------------
    // LOCAL API ENDPOINTS (Synchronizing Murid & Guru Offline / Local Network)
    // -------------------------------------------------------------------------
    if (pathname.startsWith('/api/')) {
        // 1. GET /api/students: Fetch all current student data
        if (pathname === '/api/students' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(localStudentsDatabase));
            return;
        }

        // 2. POST /api/sync: Receive student live state from Murid web
        if (pathname === '/api/sync' && req.method === 'POST') {
            parseJsonBody(req, (err, payload) => {
                if (err || !payload || !payload.identitas) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
                    return;
                }

                const cls = payload.identitas.classKey || 'X-1';
                const absen = String(payload.identitas.absen || 0).padStart(2, '0');
                const nameSlug = (payload.identitas.nama || 'siswa').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25);
                const studentKey = `absen_${absen}_${nameSlug}`;

                if (!localStudentsDatabase[cls]) {
                    localStudentsDatabase[cls] = {};
                }

                // Preserve existing teacher evaluation if already entered
                const existing = localStudentsDatabase[cls][studentKey] || {};
                const teacherEval = existing.teacherEvaluation || payload.teacherEvaluation || {};

                localStudentsDatabase[cls][studentKey] = {
                    ...payload,
                    teacherEvaluation: teacherEval,
                    _serverUpdated: new Date().toISOString()
                };

                persistLocalDatabase();

                const nd = (payload.nilai && typeof payload.nilai.digitalScore === 'number') ? payload.nilai.digitalScore : 0;
                console.log(`📡 [SYNC] ${payload.identitas.nama} (${cls} - Abs: ${payload.identitas.absen}) -> ND: ${nd} pts | Layar: ${payload.status ? payload.status.currentActivity : '-'}`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, key: studentKey }));
            });
            return;
        }

        // 3. POST /api/teacher-eval: Guru inputs presentation score
        if (pathname === '/api/teacher-eval' && req.method === 'POST') {
            parseJsonBody(req, (err, payload) => {
                const { classKey, studentKey, scorePresentasi, catatanGuru } = payload;
                if (localStudentsDatabase[classKey] && localStudentsDatabase[classKey][studentKey]) {
                    localStudentsDatabase[classKey][studentKey].teacherEvaluation = {
                        scorePresentasi: parseInt(scorePresentasi, 10) || 0,
                        catatanGuru: catatanGuru || '',
                        updatedAt: new Date().toISOString()
                    };
                    persistLocalDatabase();
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
            return;
        }

        // 4. POST /api/reset-class: Reset class
        if (pathname === '/api/reset-class' && req.method === 'POST') {
            parseJsonBody(req, (err, payload) => {
                const { classKey } = payload;
                if (classKey === 'ALL') {
                    localStudentsDatabase = {};
                } else if (classKey && localStudentsDatabase[classKey]) {
                    delete localStudentsDatabase[classKey];
                }
                persistLocalDatabase();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
            return;
        }

        // 5. DELETE /api/student: Delete single student
        if (pathname === '/api/student' && req.method === 'POST') {
            parseJsonBody(req, (err, payload) => {
                const { classKey, studentKey } = payload;
                if (localStudentsDatabase[classKey] && localStudentsDatabase[classKey][studentKey]) {
                    delete localStudentsDatabase[classKey][studentKey];
                    persistLocalDatabase();
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
            return;
        }
    }

    // -------------------------------------------------------------------------
    // STATIC FILE SERVER
    // -------------------------------------------------------------------------
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    // Safety check against directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalNetworkIp();
    console.log('\n' + '='.repeat(68));
    console.log('   🚀 LARASLOGIKA — SERVER LOKAL KELAS BERHASIL DIAKTIFKAN');
    console.log('='.repeat(68));
    console.log(`\n👨‍🏫 [KHUSUS LAPTOP GURU]:`);
    console.log(`   👉 Buka Dashboard Guru : http://localhost:${PORT}/guru.html`);
    console.log(`      (PIN Bawaan Sistem  : 123456)`);
    console.log(`   👉 Buka Web Siswa (Tes): http://localhost:${PORT}/`);
    console.log(`\n📱 [UNTUK HP / LAPTOP MURID DI KELAS (Wi-Fi / Hotspot yang Sama)]:`);
    console.log(`   👉 Berikan Link Ini ke Murid : http://${localIp}:${PORT}/`);
    console.log(`\n💡 [CARA UJI COBA BERSAMAAN PADA 1 LAPTOP]:`);
    console.log(`   1. Buka Tab Biasa      : http://localhost:${PORT}/guru.html (Guru)`);
    console.log(`   2. Buka Tab Incognito  : http://localhost:${PORT}/ (Murid)`);
    console.log(`   3. Isi identitas di Incognito, lihat data langsung muncul di Dashboard Guru!`);
    console.log(`\n🌐 [VERSI ONLINE VERCEL]:`);
    console.log(`   👉 Murid: https://game-stackandqueue.vercel.app`);
    console.log(`   👉 Guru : https://game-stackandqueue.vercel.app/guru.html`);
    console.log('='.repeat(68) + '\n');
});
