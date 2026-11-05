const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

// 1. Replace cases definition in groupProjectState
const casesStart = appJs.indexOf('selectedCase: \'case1\',\n        cases: {');
const casesEnd = appJs.indexOf('hotsAnswers: {},', casesStart);

if (casesStart === -1 || casesEnd === -1) {
    console.error('Could not find cases boundaries');
    process.exit(1);
}

const newCasesBlock = `selectedCase: 'case1',
        cases: {
            case1: {
                id: 'case1',
                icon: '🍽️',
                badge: 'Kasus 1: Antrean Kasir Kantin Sekolah (Mewakili Queue - FIFO)',
                title: 'Optimalisasi Sistem Antrean Kasir & Pemesanan Kantin Sekolah',
                category: 'Manajemen Layanan Publik & Pemesanan Kantin',
                desc: 'Pada jam istirahat sekolah yang hanya berdurasi 30 menit, kantin dipadati lebih dari 60 siswa. Karena tidak ada jalur antrean yang teratur, siswa yang baru datang sering kali langsung menyerobot ke dekat meja kasir dan dilayani duluan, sementara siswa yang sudah antre 10 menit di depan justru terabaikan. Kasir juga kewalahan mencatat urutan pemesan sehingga pesanan sering kali salah buat atau tertukar. Kondisi ini menimbulkan kegaduhan, ketidakadilan waktu tunggu, dan keterlambatan kembali ke kelas.',
                problemChallenge: 'Bagaimana merancang model antrean berbasis struktur data Queue (FIFO) dengan penetapan posisi Front (kasir) dan Rear (ujung antrean siswa baru), serta bagaimana operasi Enqueue dan Dequeue diterapkan untuk menjamin keadilan pelayanan dan mencegah antrean macet?',
                recommendedStructure: 'Queue (FIFO - First In First Out)',
                defaultItems: ['1. Antrean Siswa Budi (09.30)', '2. Antrean Siswa Siti (09.31)', '3. Antrean Siswa Ahmad (09.32)'],
                hots: {
                    mc: {
                        question: 'Mengapa sistem antrean kasir kantin sekolah wajib menerapkan struktur data Queue (FIFO) dan BUKAN Stack (LIFO)?',
                        options: [
                            { key: 'A', text: 'Karena prinsip FIFO menjamin siswa yang datang lebih awal berada di posisi Front dan dilayani pertama kali (dequeue), sehingga menciptakan keadilan pelayanan dan kepastian waktu tunggu.', isCorrect: true, feedback: 'Tepat sekali! Asas keadilan pelayanan waktu tunggu hanya dapat dijamin oleh Queue (FIFO).' },
                            { key: 'B', text: 'Karena Queue memperbolehkan siswa yang baru datang menyerobot langsung ke posisi Front.' },
                            { key: 'C', text: 'Karena memori Queue tidak memerlukan pemrosesan komputer.' },
                            { key: 'D', text: 'Karena Queue otomatis membatalkan pesanan yang belum selesai.' }
                        ]
                    },
                    tf: [
                        {
                            id: 'tf1',
                            statement: 'Ketika seorang siswa baru datang ke kantin dan bergabung ke barisan belakang, operasi yang terjadi adalah Enqueue pada posisi Rear.',
                            isTrue: true,
                            feedback: 'Tepat! Elemen baru dalam Queue selalu ditambahkan di bagian belakang (Rear) melalui operasi Enqueue.'
                        },
                        {
                            id: 'tf2',
                            statement: 'Jika kasir melayani siswa yang berdiri paling belakang alih-alih siswa di depan, maka kasir tersebut sedang menjalankan operasi Dequeue yang sah.',
                            isTrue: false,
                            feedback: 'Salah! Dequeue selalu mengambil elemen dari posisi paling depan (Front), bukan dari belakang.'
                        },
                        {
                            id: 'tf3',
                            statement: 'Kondisi Queue Underflow terjadi saat kasir memanggil pesanan berikutnya (dequeue), namun tidak ada lagi siswa yang berdiri di dalam antrean.',
                            isTrue: true,
                            feedback: 'Tepat! Mengambil elemen dari Queue yang kosong menghasilkan galat Underflow.'
                        }
                    ],
                    essayGuide: 'Jelaskan bagaimana konsep Front dan Rear pada Queue mencegah penyerobotan antrean di kasir kantin!'
                }
            },
            case2: {
                id: 'case2',
                icon: '🥞',
                badge: 'Kasus 2: Tumpukan Piring Bersih & Baki Kantin (Mewakili Stack - LIFO)',
                title: 'Manajemen Tumpukan Baki Saji & Piring Bersih Kantin Sekolah',
                category: 'Pengelolaan Inventaris Saji & Mekanisme LIFO',
                desc: 'Petugas dapur kantin bertugas mencuci, mengeringkan, dan menata piring saji serta baki makan untuk siswa. Piring-piring bersih ditumpuk secara vertikal di atas meja dispenser saji (kapasitas maksimal 5 piring). Siswa mengambil piring bersih dari bagian paling atas tumpukan untuk mengambil makanan. Ketika jam sibuk, petugas terus menambahkan piring bersih dari atas (push), sementara siswa terus mengambil piring teratas (pop). Jika piring ditumpuk melebihi 5, tumpukan tidak stabil dan rawan jatuh pecah (Stack Overflow). Sebaliknya, jika piring habis dan siswa tetap mencoba mengambil, terjadi keterlambatan saji (Stack Underflow).',
                problemChallenge: 'Bagaimana menganalisis alur sirkulasi piring saji menggunakan struktur data Stack (LIFO), dan bagaimana menetapkan algoritma kontrol kapasitas tumpukan agar tidak terjadi kondisi Stack Overflow maupun Stack Underflow?',
                recommendedStructure: 'Stack (LIFO - Last In First Out)',
                defaultItems: ['Piring Keramik Putih #1 (Dasar)', 'Piring Keramik Putih #2', 'Piring Keramik Putih #3 (TOP)'],
                hots: {
                    mc: {
                        question: 'Mengapa mekanisme dispenser piring bersih di meja saji kantin secara alami memodelkan struktur data Stack (LIFO)?',
                        options: [
                            { key: 'A', text: 'Karena piring yang terakhir kali ditaruh oleh petugas di posisi puncak (TOP) adalah piring yang pertama kali diambil oleh siswa (Last In First Out).', isCorrect: true, feedback: 'Tepat sekali! Akses penambahan (push) dan pengambilan (pop) piring hanya dapat dilakukan melalui satu pintu akses yaitu di posisi paling atas (TOP).' },
                            { key: 'B', text: 'Karena siswa dapat mengambil piring dari bagian paling bawah tumpukan tanpa menyentuh piring di atasnya.' },
                            { key: 'C', text: 'Karena piring bersih yang masuk pertama kali akan diambil pertama kali oleh siswa.' },
                            { key: 'D', text: 'Karena dispenser piring memiliki dua pintu keluar masuk di atas dan di bawah.' }
                        ]
                    },
                    tf: [
                        {
                            id: 'tf1',
                            statement: 'Saat petugas kantin meletakkan piring bersih baru ke atas tumpukan, operasi komputasional yang dieksekusi adalah operasi Push pada posisi TOP.',
                            isTrue: true,
                            feedback: 'Benar! Operasi push menambahkan elemen ke puncak tumpukan Stack.'
                        },
                        {
                            id: 'tf2',
                            statement: 'Operasi peek() pada tumpukan piring bersih bertujuan untuk mengambil dan memindahkan piring teratas ke meja makan siswa.',
                            isTrue: false,
                            feedback: 'Salah! Operasi peek() hanya melihat atau memeriksa status elemen teratas (TOP) tanpa menghapus atau mengambilnya.'
                        },
                        {
                            id: 'tf3',
                            statement: 'Kondisi Stack Overflow terjadi ketika dispenser piring yang sudah mencapai kapasitas maksimal (5 piring) tetap dipaksakan untuk ditambah piring baru oleh petugas.',
                            isTrue: true,
                            feedback: 'Tepat! Menambahkan elemen ke wadah Stack yang sudah penuh memicu kondisi galat Stack Overflow.'
                        }
                    ],
                    essayGuide: 'Jelaskan bagaimana algoritma pengecekan kapasitas (isFull dan isEmpty) mencegah kecelakaan piring pecah (Overflow) atau piring kosong (Underflow)!'
                }
            }
        },\n        `;

appJs = appJs.substring(0, casesStart) + newCasesBlock + appJs.substring(casesEnd);
console.log('Successfully updated cases in app.js!');

// 2. Update default members in groupProjectState
appJs = appJs.replace(
`        members: [
            { name: '', role: '👑 Ketua Kelompok' },
            { name: '', role: '🔍 Analis Struktur Data' },
            { name: '', role: '📝 Notulis / Penyusun' }
        ],`,
`        members: [
            { name: '', absen: '', role: '👑 Ketua / Koordinator Tim' },
            { name: '', absen: '', role: '📝 Notulis / Perumus Masalah' },
            { name: '', absen: '', role: '🧪 Operator Simulasi & Pengujian' },
            { name: '', absen: '', role: '🔍 Analis Struktur Data' },
            { name: '', absen: '', role: '⚙️ Perancang Solusi Algoritmik' },
            { name: '', absen: '', role: '📢 Presenter / Juru Bicara' }
        ],`
);

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Saved app.js part 1');

