const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Stack Video Card
const stackTarget = `<div class="learn-tab-pane active" data-tab-pane="concept">
                        <p style="font-size: 1.05rem; line-height: 1.65; margin-bottom: 0.85rem;">
                            <strong>Stack (Tumpukan)</strong>`;

const stackVideoHtml = `<div class="learn-tab-pane active" data-tab-pane="concept">
                        <!-- Video Animasi Edukatif Konsep Stack (LIFO) -->
                        <div class="theory-card studio-video-card" style="margin-bottom: 1.75rem; background: #FFFFFF; border: 2px solid #D8D4BC; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(113, 66, 54, 0.06);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                                <span class="academic-badge academic-badge-indigo" style="font-size: 0.75rem;">🎬 Video Animasi Konsep Stack</span>
                                <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #891A10; font-weight: 700;">DURASI: 10 DETIK &bull; LIFO DEMO</span>
                            </div>
                            <h3 style="font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: #714236; margin: 0 0 0.5rem 0;">
                                Simulasi Visual: Prinsip Kerja Stack pada Tumpukan Piring Saji Kantin
                            </h3>
                            <p style="font-size: 0.92rem; color: #4A3832; line-height: 1.6; margin-bottom: 1rem;">
                                Tonton animasi interaktif berikut untuk melihat bagaimana petugas kantin menaruh piring saji dari atas tumpukan (<em>push</em>) dan siswa mengambil piring dari posisi paling atas (<em>pop</em>). Piring yang terakhir kali ditaruh menjadi yang pertama diambil (<em>Last In, First Out</em>).
                            </p>
                            <div style="position: relative; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 720px; margin: 0 auto;">
                                <video controls playsinline style="width: 100%; max-height: 420px; display: block; margin: 0 auto; background: #000;">
                                    <source src="assets/videos/video_stack.mp4" type="video/mp4">
                                    Browser Anda tidak mendukung pemutar video HTML5.
                                </video>
                            </div>
                        </div>

                        <p style="font-size: 1.05rem; line-height: 1.65; margin-bottom: 0.85rem;">
                            <strong>Stack (Tumpukan)</strong>`;

if (html.includes(stackTarget)) {
    html = html.replace(stackTarget, stackVideoHtml);
    console.log('Successfully inserted Stack video card!');
} else {
    console.error('Stack target not found!');
}

// 2. Queue Video Card
const queueTarget = `<div class="learn-tab-pane active" data-tab-pane="concept">
                        <p style="font-size: 1.05rem; line-height: 1.65; margin-bottom: 0.85rem;">
                            <strong>Queue (Antrean)</strong>`;

const queueVideoHtml = `<div class="learn-tab-pane active" data-tab-pane="concept">
                        <!-- Video Animasi Edukatif Konsep Queue (FIFO) -->
                        <div class="theory-card studio-video-card" style="margin-bottom: 1.75rem; background: #FFFFFF; border: 2px solid #D8D4BC; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(113, 66, 54, 0.06);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                                <span class="academic-badge academic-badge-blue" style="font-size: 0.75rem;">🎬 Video Animasi Konsep Queue</span>
                                <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #E76814; font-weight: 700;">DURASI: 10 DETIK &bull; FIFO DEMO</span>
                            </div>
                            <h3 style="font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: #714236; margin: 0 0 0.5rem 0;">
                                Simulasi Visual: Prinsip Kerja Queue pada Pelayanan Kasir Kantin
                            </h3>
                            <p style="font-size: 0.92rem; color: #4A3832; line-height: 1.6; margin-bottom: 1rem;">
                                Tonton animasi interaktif berikut untuk melihat bagaimana siswa yang datang lebih awal berada di posisi depan (<em>Front</em>) dan dilayani pertama kali saat kasir memproses pesanan (<em>dequeue</em>), sementara siswa baru bergabung di barisan paling belakang (<em>Rear / enqueue</em>) demi keadilan layanan (<em>First In, First Out</em>).
                            </p>
                            <div style="position: relative; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 720px; margin: 0 auto;">
                                <video controls playsinline style="width: 100%; max-height: 420px; display: block; margin: 0 auto; background: #000;">
                                    <source src="assets/videos/video_queue.mp4" type="video/mp4">
                                    Browser Anda tidak mendukung pemutar video HTML5.
                                </video>
                            </div>
                        </div>

                        <p style="font-size: 1.05rem; line-height: 1.65; margin-bottom: 0.85rem;">
                            <strong>Queue (Antrean)</strong>`;

if (html.includes(queueTarget)) {
    html = html.replace(queueTarget, queueVideoHtml);
    console.log('Successfully inserted Queue video card!');
} else {
    console.error('Queue target not found!');
}

fs.writeFileSync('index.html', html, 'utf8');

