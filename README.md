# DAILY RUSH: STACK & QUEUE ADVENTURE
### *Petualangan Interaktif Struktur Data Stack (LIFO) & Queue (FIFO)*

**Daily Rush** adalah media pembelajaran berbasis game edukasi interaktif *(educational game)* yang dirancang untuk siswa SMA Kelas X (Fase E) dalam mata pelajaran **Informatika**. Game ini membantu siswa memahami konsep abstrak struktur data **Stack** dan **Queue** melalui skenario kehidupan sehari-hari, simulasi langsung *(hands-on simulation)*, teka-teki logika *(puzzles)*, mini-games, dan evaluasi hasil belajar yang komprehensif.

---

## 🎯 1. Capaian & Tujuan Pembelajaran (Learning Objectives)

### STACK (Tumpukan)
* Memahami prinsip dasar **LIFO** *(Last In, First Out)*: elemen yang terakhir dimasukkan adalah yang pertama kali dikeluarkan.
* Menguasai method & operasi Stack:
  * `push(item)`: Menambahkan elemen baru ke puncak *(TOP)* tumpukan.
  * `pop()`: Mengambil & menghapus elemen teratas *(TOP)*.
  * `peek()`: Melihat isi elemen teratas tanpa mengubah ukuran tumpukan.
  * `isEmpty()`: Memeriksa apakah tumpukan kosong untuk mencegah kondisi *Underflow*.
* Contoh penerapan nyata:
  * Tumpukan piring bersih di kafetaria.
  * Susunan kardus kargo di lorong gudang sempit.
  * Tumpukan buku di meja perpustakaan.
  * Riwayat tombol *Back* pada web browser.
  * Fitur pembatalan tindakan *Undo* (Ctrl+Z) pada aplikasi pengolah kata/grafis.

### QUEUE (Antrean)
* Memahami prinsip dasar **FIFO** *(First In, First Out)*: elemen yang pertama kali datang adalah yang pertama kali dilayani/keluar.
* Menguasai method & operasi Queue:
  * `enqueue(item)`: Menambahkan elemen baru di posisi paling belakang *(REAR)* antrean.
  * `dequeue()`: Melayani dan mengeluarkan elemen terdepan *(FRONT)*.
  * `front()`: Melihat elemen paling depan tanpa mengubah antrean.
  * `isEmpty()`: Memeriksa kekosongan antrean.
* Contoh penerapan nyata:
  * Antrean pembayaran di kasir supermarket.
  * Barisan pengambilan makan siang di kantin sekolah.
  * Antrean loket tiket bioskop dan bank.
  * Penjadwalan cetak dokumen pada printer *(Printer Spooler Queue)*.

---

## 🗺 2. Struktur 8 Level Petualangan (World Map)

Game ini menyajikan peta petualangan interaktif dengan sistem pembukaan level bertahap *(progressive unlocking)*:

| Level | Lokasi | Topik Pembelajaran | Mode Interaksi |
|---|---|---|---|
| **Level 1** | 🏫 Sekolah *(School)* | Gerbang Pengenalan Stack & Queue | Konseptual, peragaan visual, dan kuis pemahaman awal |
| **Level 2** | 📦 Gudang *(Warehouse)* | Laboratorium Simulasi Stack | Hands-on push, pop, peek pada simulator Stack sesungguhnya |
| **Level 3** | 🍽 Kantin *(Cafeteria)* | Laboratorium Simulasi Queue | Hands-on enqueue, dequeue, front pada simulator Queue sesungguhnya |
| **Level 4** | 📚 Perpustakaan *(Library)* | Tantangan Tumpukan Buku & Kardus Gudang | Mini-game pencarian buku target dan bongkar muat kargo LIFO |
| **Level 5** | 🛒 Supermarket | Tantangan Kasir Rame & Kantin Sekolah | Mini-game antrean pelanggan kasir ber-ticket dan barisan makan FIFO |
| **Level 6** | 🧩 Zona Puzzle *(Puzzle Zone)* | 5 Teka-Teki Logika Interaktif | Drag-and-drop urutan kedatangan, penarikan tumpukan, matching konsep |
| **Level 7** | 🎫 Loket & Lab *(Tech Lab)* | Simulasi Kasus Nyata Tingkat Lanjut | Studi kasus printer spooler, URL browser history stack, dan undo |
| **Level 8** | 🏆 Arena Juara *(Champion Arena)* | Evaluasi Akhir Juara Petualang | Ujian komprehensif 10 skenario kontekstual untuk penilaian akhir |

---

## 🎮 3. Fitur Utama Aplikasi

1. **Implementasi Struktur Data Murni (OOP)**:
   * Bukan simulasi palsu: logika aplikasi dijalankan oleh `class Stack` dan `class Queue` JavaScript asli dengan method `push`, `pop`, `peek`, `enqueue`, `dequeue`, dan `front`.
2. **Sistem Bilingual Penuh (ID 🇮🇩 / EN 🇬🇧)**:
   * Dilengkapi kamus terpusat (`translations.js`) yang memungkinkan pergantian bahasa secara instan tanpa memuat ulang halaman.
3. **Penyimpanan Lokal (LocalStorage Persistence)**:
   * Menyimpan nama siswa, level yang sudah terbuka, perolehan skor tiap level, riwayat log seluruh jawaban, dan piala prestasi.
4. **Sintesis Audio Web Audio API**:
   * Menghasilkan efek suara interaktif (arpeggio benar, boop salah, swoosh push/pop, nada enqueue/dequeue, dan fanfare kelulusan) tanpa dependensi file eksternal (100% offline).
5. **Karakter Pemandu Siswa ("Kiko")**:
   * Karakter robot pemandu yang ramah dan interaktif memberikan tips belajar, reaksi ekspresi wajah, serta umpan balik motivatif.
6. **Zona Puzzle Drag-and-Drop & Touch-Friendly**:
   * Mendukung interaksi mouse dan sentuhan layar *(touch)* dengan mode klik-lalu-tempatkan sehingga nyaman dimainkan di tablet maupun HP.
7. **Rapor Hasil Belajar & Lembar Cetak Guru (`window.print`)**:
   * Menampilkan Nilai Rata-rata Akhir (Skala 100), Predikat Hasil Belajar (*Sangat Baik, Baik, Cukup, Perlu Berlatih, Perlu Belajar Lagi*), Akurasi Jawaban, Waktu Pengerjaan, serta Rincian Penguasaan Konsep.
   * Mode cetak otomatis menghasilkan lembar laporan resmi lengkap dengan kolom tanda tangan guru dan siswa.
8. **Fitur Review Jawaban**:
   * Siswa dan guru dapat meninjau kembali setiap pertanyaan yang telah dijawab, melihat pilihan siswa vs jawaban benar, serta membaca penjelasan konsep secara mendalam.

---

## 💻 4. Struktur Berkas (Project Structure)

```text
daily-rush/
│
├── index.html              # Halaman utama aplikasi (Single Page Application)
├── README.md               # Dokumentasi pedagogis dan teknis
│
├── css/
│   ├── style.css           # Desain token, header, navbar, kartu, tombol 3D
│   ├── home.css            # Tampilan World Map & hero banner
│   ├── learning.css        # Simulator visual Stack & Queue
│   ├── game.css            # Tampilan 6 mini-game kontekstual
│   ├── puzzle.css          # Desain zona puzzle & kartu drag-and-drop
│   ├── challenge.css       # Tampilan arena soal kontekstual & opsi
│   ├── result.css          # Kartu rapor hasil akhir & cetak resmi
│   └── animations.css      # Animasi micro-interactions, awan, getar, & partikel
│
└── js/
    ├── translations.js     # Kamus bilingual (Indonesia & English)
    ├── audio.js            # Generator efek suara Web Audio API
    ├── storage.js          # Pengelola data LocalStorage
    ├── stack.js            # Real Stack Object Class (LIFO)
    ├── queue.js            # Real Queue Object Class (FIFO)
    ├── player.js           # Profil pemain & session tracker
    ├── scoring.js          # Mesin penilaian, predikat, & analitik belajar
    ├── achievements.js     # Sistem penghargaan & badge prestasi
    ├── levels.js           # Konfigurasi 8 level petualangan
    ├── games.js            # Logika 6 mini-game interaktif
    ├── puzzles.js          # Logika 5 puzzle interaktif
    ├── challenges.js       # Bank soal kontekstual & evaluasi
    ├── ui.js               # Pengendali antarmuka & karakter Kiko
    ├── app.js              # Koordinator event global & simulator lab
    └── main.js             # Bootstrap inisialisasi aplikasi
```

---

## 🚀 5. Cara Menjalankan

Game ini dibuat murni menggunakan teknologi standar web: **HTML5, CSS3, dan Vanilla JavaScript**, tanpa memerlukan build step *(no npm install, no bundler, no backend server)*.

1. Buka folder proyek di file explorer komputer Anda.
2. Klik ganda pada berkas `index.html` untuk langsung membukanya di browser modern mana pun (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. Anda juga dapat menjalankannya melalui server lokal sederhana seperti VS Code Live Server atau Python HTTP server:
   ```bash
   python -m http.server 8080
   ```
   Lalu buka `http://localhost:8080` pada peramban web.
