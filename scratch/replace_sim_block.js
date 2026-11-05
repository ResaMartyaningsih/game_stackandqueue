const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('getSimulationButtonsHTML(caseId) {');
const eIdx = appJs.indexOf('renderCaseSimulationLog() {', sIdx);

if (sIdx === -1 || eIdx === -1) {
    console.error('Could not find simulation block boundaries');
    process.exit(1);
}

const newSimBlock = `getSimulationButtonsHTML(caseId) {
        if (caseId === 'case1') {
            return \`
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('enqueue_student')">➕ Siswa Masuk Antrean (Enqueue Rear)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-amber" onclick="App.runCaseSimulation('dequeue_kasir')">➔ Kasir Layani Siswa Terdepan (Dequeue Front)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('peek_front')">👁️ Cek Siswa Terdepan (Peek Front)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-outline" onclick="App.runCaseSimulation('reset')">🔄 Reset Antrean</button>
            \`;
        } else {
            return \`
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('push_plate')">➕ Petugas Tambah Piring (Push TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-amber" onclick="App.runCaseSimulation('pop_plate')">➔ Siswa Ambil Piring Teratas (Pop TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('peek_top')">👁️ Cek Piring Teratas (Peek TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-outline" onclick="App.runCaseSimulation('reset')">🔄 Reset Tumpukan</button>
            \`;
        }
    },

    renderCaseSimulationViewport() {
        const vp = document.getElementById('gp-sim-viewport');
        if (!vp) return;

        const caseId = this.groupProjectState.selectedCase;
        const sim = this.groupProjectState.simState;

        if (!sim.items || sim.items.length === 0) {
            vp.innerHTML = \`<span style="color: #8F726A; font-size: 0.88rem; font-style: italic;">Antrean / tumpukan data saat ini kosong (Underflow). Gunakan tombol di atas untuk menyimulasikan operasi aliran data.</span>\`;
            return;
        }

        if (caseId === 'case1') {
            // Queue FIFO Horizontal Track
            vp.innerHTML = \`
                <div style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: 'Space Mono', monospace; font-weight: 700; color: #714236; margin-bottom: 0.5rem;">
                        <span>🚪 FRONT (Meja Kasir - Dilayani Duluan) ➔</span>
                        <span> REAR (Siswa Baru Masuk Antrean)</span>
                    </div>
                    <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding: 0.5rem 0;">
                        \${sim.items.map((it, idx) => {
                            const isFront = idx === 0;
                            const isRear = idx === sim.items.length - 1;
                            return \`
                                <div class="gp-sim-item-badge" style="background: \${isFront ? '#891A10' : '#E76814'}; color: #FFFFFF; border-radius: 8px; padding: 0.6rem 0.9rem; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(113, 66, 54, 0.2);">
                                    \${isFront ? '👑 FRONT: ' : (isRear ? '📍 REAR: ' : '👤 ')}\${it}
                                </div>
                            \`;
                        }).join('')}
                    </div>
                </div>
            \`;
        } else {
            // Stack LIFO Vertical Chamber (Dispenser Piring)
            const maxCap = 5;
            vp.innerHTML = \`
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                    <div style="font-size: 0.78rem; font-family: 'Space Mono', monospace; font-weight: 700; color: #891A10; margin-bottom: 0.5rem;">
                        ⬇️ SATU PINTU AKSES: TOP OF STACK (Push & Pop dari Sini) ⬇️
                    </div>
                    <div style="width: 100%; max-width: 440px; display: flex; flex-direction: column-reverse; gap: 0.5rem; background: #FAF6ED; border: 2px solid #D8D4BC; border-radius: 12px; padding: 1rem;">
                        \${sim.items.map((it, idx) => {
                            const isTop = idx === sim.items.length - 1;
                            return \`
                                <div style="background: \${isTop ? '#891A10' : '#DC8236'}; color: #FFFFFF; border-radius: 8px; padding: 0.6rem 1rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(113, 66, 54, 0.15);">
                                    <span>🍽️ \${it}</span>
                                    <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">
                                        \${isTop ? '★ TOP (Paling Atas)' : \`Posisi #\${idx + 1}\`}
                                    </span>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                    <div style="font-size: 0.78rem; color: #714236; margin-top: 0.4rem;">
                        Kapasitas Dispenser: <strong>\${sim.items.length} / \${maxCap} Piring</strong> \${sim.items.length >= maxCap ? '<span style="color: #B8210F; font-weight: bold;">(PENUH / Overflow Warning)</span>' : ''}
                    </div>
                </div>
            \`;
        }
    },

    runCaseSimulation(action) {
        const caseId = this.groupProjectState.selectedCase;
        const sim = this.groupProjectState.simState;
        let soundToPlay = 'click';

        if (caseId === 'case1') {
            // Queue Kasir Kantin
            if (action === 'enqueue_student') {
                const pool = ['Dian (Nasi Goreng)', 'Fajar (Soto Ayam)', 'Lestari (Mie Ayam)', 'Rafi (Batagor)', 'Nabila (Es Teh)', 'Bagus (Roti Bakar)'];
                const student = pool[Math.floor(Math.random() * pool.length)];
                sim.items.push(\`Siswa \${student}\`);
                sim.logs.unshift(\`[ENQUEUE FIFO] Siswa "\${student}" datang dan masuk antrean di barisan paling belakang (REAR). Total antrean: \${sim.items.length}.\`);
                soundToPlay = 'enqueue';
            } else if (action === 'dequeue_kasir') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(\`⚠️ [QUEUE UNDERFLOW] Antrean kasir sedang kosong! Kasir menunggu kedatangan siswa berikutnya.\`);
                } else {
                    const served = sim.items.shift();
                    sim.logs.unshift(\`✅ [DEQUEUE FIFO] Kasir selesai memproses pembayaran dan menyerahkan pesanan kepada: \${served} (keluar dari FRONT).\`);
                    soundToPlay = 'dequeue';
                }
            } else if (action === 'peek_front') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(\`👁️ [PEEK FRONT] Antrean kosong, tidak ada siswa di posisi depan.\`);
                } else {
                    sim.logs.unshift(\`👁️ [PEEK FRONT] Siswa yang saat ini berada di depan meja kasir adalah: \${sim.items[0]} (sedang bersiap memesan).\`);
                }
            } else if (action === 'reset') {
                this.resetCaseSimulationData();
                return;
            }
        } else {
            // Stack Tumpukan Piring (maks 5 piring)
            const maxCap = 5;
            if (action === 'push_plate') {
                if (sim.items.length >= maxCap) {
                    sim.logs.unshift(\`⚠️ [STACK OVERFLOW] Kapasitas dispenser penuh (\${maxCap} piring)! Jangan tambah piring lagi agar tidak goyang dan jatuh pecah.\`);
                } else {
                    const plateNum = sim.items.length + 1;
                    const plateName = \`Piring Keramik Putih #\${plateNum}\`;
                    sim.items.push(plateName);
                    sim.logs.unshift(\`[PUSH STACK] Petugas dapur menaruh \${plateName} bersih ke posisi paling atas (TOP). Tumpukan saat ini: \${sim.items.length} piring.\`);
                    soundToPlay = 'push';
                }
            } else if (action === 'pop_plate') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(\`⚠️ [STACK UNDERFLOW] Dispenser piring bersih kosong! Siswa harus menunggu petugas dapur mencuci piring baru.\`);
                } else {
                    const popped = sim.items.pop();
                    sim.logs.unshift(\`✅ [POP STACK] Siswa mengambil \${popped} dari posisi paling atas (TOP) untuk mengambil makanan. Sisa: \${sim.items.length} piring.\`);
                    soundToPlay = 'pop';
                }
            } else if (action === 'peek_top') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(\`👁️ [PEEK TOP] Dispenser piring kosong, tidak ada piring di posisi puncak.\`);
                } else {
                    sim.logs.unshift(\`👁️ [PEEK TOP] Piring yang berada di puncak tumpukan saat ini adalah: \${sim.items[sim.items.length - 1]}.\`);
                }
            } else if (action === 'reset') {
                this.resetCaseSimulationData();
                return;
            }
        }

        if (window.AudioController && soundToPlay) {
            AudioController.play(soundToPlay);
        }

        this.renderCaseSimulationViewport();
        this.renderCaseSimulationLog();
    },

    `;

appJs = appJs.substring(0, sIdx) + newSimBlock + appJs.substring(eIdx);
fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Successfully replaced simulation block in js/app.js');

