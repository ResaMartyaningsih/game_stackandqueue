const fs = require('fs');

const questions = [
    {
        num: 1,
        cognitive: "C4 - Analisis Ketidaktepatan Antrean",
        title: "Analisis Ketidaktepatan Sistem Antrean Kantin",
        stimulus: "Pada jam istirahat sekolah, kantin dipadati 30 siswa tanpa jalur antrean fisik. Siswa yang baru saja datang dari pintu samping langsung menyerobot ke dekat meja kasir dan dilayani lebih dahulu oleh penjual, sedangkan siswa yang telah mengantre tertib selama 10 menit di barisan depan belum dilayani. Akibatnya terjadi kegaduhan dan keluhan ketidakadilan waktu tunggu.",
        q: "Berdasarkan prinsip berpikir komputasional dan struktur data, analisislah pelanggaran mendasar yang terjadi pada skenario pelayanan kantin tersebut serta tentukan pemodelan solusi algoritmik yang paling tepat!",
        options: [
            "Pelayanan melanggar prinsip FIFO (First In, First Out) dari struktur data Queue; solusinya adalah menerapkan jalur antrean fisik tunggal di mana siswa yang tiba lebih awal (Front) wajib dilayani dan keluar lebih dahulu (dequeue) sebelum melayani siswa di belakangnya (Rear).",
            "Pelayanan melanggar prinsip LIFO (Last In, First Out) dari struktur data Stack; solusinya adalah mewajibkan siswa yang baru datang dilayani terlebih dahulu agar tidak menumpuk di pintu masuk kantin.",
            "Pelayanan melanggar prinsip Priority Queue; solusinya adalah memberikan prioritas pelayanan kepada siswa yang membeli makanan dengan harga tertinggi tanpa melihat waktu kedatangan.",
            "Pelayanan melanggar prinsip Array dua dimensi; solusinya adalah membagi siswa ke dalam baris dan kolom acak di seluruh ruangan kantin."
        ]
    },
    {
        num: 2,
        cognitive: "C4 - Analisis Tracing Operasi Stack",
        title: "Analisis Tracing Operasi Beruntun Stack",
        stimulus: "Petugas kantin menata baki saji makanan menggunakan mekanisme tumpukan vertikal (Stack) dengan kapasitas maksimal 5 baki. Sistem mencatat riwayat operasi berturut-turut: push(Baki Merah) → push(Baki Kuning) → push(Baki Hijau) → pop() → push(Baki Biru) → pop() → push(Baki Ungu).",
        q: "Lakukan penelusuran (tracing) terhadap riwayat operasi tersebut. Analisislah baki mana saja yang telah berhasil dikeluarkan dari tumpukan serta tentukan baki mana yang saat ini menempati posisi puncak (Top of Stack)!",
        options: [
            "Baki yang telah dikeluarkan adalah Baki Hijau lalu Baki Biru; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Ungu.",
            "Baki yang telah dikeluarkan adalah Baki Merah lalu Baki Kuning; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Hijau.",
            "Baki yang telah dikeluarkan adalah Baki Biru lalu Baki Hijau; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Merah.",
            "Baki yang telah dikeluarkan adalah Baki Ungu lalu Baki Biru; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Kuning."
        ]
    },
    {
        num: 3,
        cognitive: "C3 - Penerapan Operasi Dasar Stack",
        title: "Penerapan Operasi Push, Pop, dan Peek",
        stimulus: "Di meja prasmanan kantin, sebuah dispenser piring bersih menampung piring keramik menggunakan prinsip Stack. Saat ini tumpukan berisi dua piring dari bawah ke atas: [Piring A, Piring B] di mana Piring B berada di posisi Top. Asisten kantin kemudian menjalankan urutan instruksi: 1) Melakukan peek(); 2) Melakukan push(Piring C); 3) Melakukan pop(); 4) Melakukan peek() kembali.",
        q: "Tentukan secara berurutan hasil identifikasi piring dari operasi peek() pertama, piring yang terambil saat pop(), dan hasil dari operasi peek() kedua!",
        options: [
            "peek() pertama menghasilkan Piring B; pop() mengeluarkan Piring C; dan peek() kedua menghasilkan Piring B.",
            "peek() pertama menghasilkan Piring A; pop() mengeluarkan Piring B; dan peek() kedua menghasilkan Piring C.",
            "peek() pertama menghasilkan Piring B; pop() mengeluarkan Piring A; dan peek() kedua menghasilkan Piring C.",
            "peek() pertama menghasilkan Piring C; pop() mengeluarkan Piring C; dan peek() kedua menghasilkan Piring A."
        ]
    },
    {
        num: 4,
        cognitive: "C3 - Penerapan Operasi Dasar Queue",
        title: "Penerapan Operasi Enqueue dan Dequeue",
        stimulus: "Sebuah sistem antrean digital pemesanan makanan kasir kantin menerapkan struktur data Queue dengan representasi antrean saat ini dari depan ke belakang (Front ke Rear): [Rizky, Siti] di mana Rizky berada di posisi Front. Selanjutnya terjadi urutan aktivitas: 1) Ahmad mengambil nomor antrean (enqueue); 2) Kasir selesai memproses pesanan dan memanggil siswa di posisi terdepan (dequeue); 3) Budi mengambil nomor antrean (enqueue); 4) Citra mengambil nomor antrean (enqueue).",
        q: "Tentukan siswa yang dipanggil keluar dari antrean pada langkah ke-2, serta susunan urutan antrean siswa yang tersisa di depan kasir saat ini mulai dari Front hingga Rear!",
        options: [
            "Siswa yang keluar adalah Rizky; dan susunan antrean saat ini dari Front ke Rear adalah [Siti, Ahmad, Budi, Citra].",
            "Siswa yang keluar adalah Siti; dan susunan antrean saat ini dari Front ke Rear adalah [Rizky, Ahmad, Budi, Citra].",
            "Siswa yang keluar adalah Ahmad; dan susunan antrean saat ini dari Front ke Rear adalah [Citra, Budi, Siti, Rizky].",
            "Siswa yang keluar adalah Rizky; dan susunan antrean saat ini dari Front ke Rear adalah [Citra, Budi, Ahmad, Siti]."
        ]
    },
    {
        num: 5,
        cognitive: "C4 - Analisis & Evaluasi Struktur Data",
        title: "Evaluasi Kesalahan Pemilihan Struktur Data",
        stimulus: "Kantin sekolah membuat aplikasi pemesanan makan siang berbasis web agar siswa dapat memesan menu sebelum jam istirahat. Namun, programmer pemula yang membuat aplikasi tersebut salah memilih struktur data: ia mengimplementasikan Stack (LIFO) untuk daftar tunggu pemesanan makanan, bukan Queue (FIFO). Siswa pertama (Andi) memesan pada pukul 09.00, disusul Bella pada 09.15, dan Candra pada 09.25.",
        q: "Evaluasilah dampak yang dialami oleh para pemesan akibat kesalahan pemilihan struktur data tersebut, dan tentukan alasan komputasional mengapa sistem tersebut gagal memenuhi keadilan layanan!",
        options: [
            "Candra akan dilayani paling awal sedangkan Andi (pemesan paling awal) justru dilayani paling akhir; hal ini terjadi karena Stack memprioritaskan elemen yang paling akhir masuk (Last In First Out), sehingga melanggar asas keadilan waktu pemesanan.",
            "Andi akan dilayani paling awal tetapi pesanan Candra otomatis terhapus karena kapasitas memori Stack langsung penuh (Overflow).",
            "Seluruh pesanan Andi, Bella, dan Candra akan diproses secara serentak (paralel) sehingga dapur kantin mengalami kelebihan beban komputasi.",
            "Tidak ada dampak yang terjadi karena struktur data Stack dan Queue memiliki mekanisme urutan pemrosesan data yang sama persis dalam antrean."
        ]
    }
];

const letters = ['A', 'B', 'C', 'D'];

let formHtml = `<form id="evaluation-form" onsubmit="event.preventDefault(); PBLAcademic.submitEvaluation();">\n`;

questions.forEach(q => {
    formHtml += `                        <!-- Soal ${q.num} -->
                        <div style="background: #FFFFFF; border: 2px solid #D8D4BC; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 16px rgba(113, 66, 54, 0.04);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
                                <span class="academic-badge academic-badge-indigo" style="font-size: 0.75rem;">Butir Soal #${q.num} &bull; ${q.cognitive}</span>
                                <span style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #891A10; font-weight: 700;">BOBOT: 20 POIN</span>
                            </div>
                            <div style="background: #FAF6ED; border-left: 4px solid #E76814; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 0.85rem; font-size: 0.92rem; color: #4A3832; line-height: 1.6;">
                                <strong>Stimulus Kasus:</strong> ${q.stimulus}
                            </div>
                            <p style="font-weight: 800; font-size: 0.98rem; color: #714236; margin-bottom: 0.85rem; line-height: 1.5;">
                                ${q.q}
                            </p>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
`;
    q.options.forEach((opt, idx) => {
        formHtml += `                                <label class="academic-option-btn" style="display: flex; gap: 0.75rem; align-items: flex-start; cursor: pointer; padding: 0.85rem 1rem; border: 1.5px solid #D8D4BC; border-radius: 10px; margin-bottom: 0.5rem; background: #FAF8F5;">
                                    <input type="radio" name="eval-q${q.num}" value="${idx}" style="margin-top: 4px;" ${idx === 0 ? 'required' : ''}>
                                    <span style="font-size: 0.92rem; color: #2B1D19; line-height: 1.5;"><strong>${letters[idx]}.</strong> ${opt}</span>
                                </label>\n`;
    });
    formHtml += `                            </div>
                        </div>\n\n`;
});

formHtml += `                        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                            <button type="submit" class="academic-btn academic-btn-primary" style="font-size: 1rem; padding: 0.85rem 2rem;">
                                🚀 Kirim &amp; Hitung Nilai Evaluasi
                            </button>
                        </div>
                    </form>`;

fs.writeFileSync('scratch/eval_form_new.html', formHtml, 'utf8');
console.log('Generated eval_form_new.html with length:', formHtml.length);

