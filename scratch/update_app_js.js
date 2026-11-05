const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Add recordMiniLabOp and wire up hands-on functions
const handsOnOld = `    handsOnPushPlate() {
        const colors = ["Piring Biru", "Piring Kuning", "Piring Ungu", "Piring Oranye"];
        const nextColor = colors[this.learnStackPlates.length % colors.length];
        if (this.learnStackPlates.length >= 5) {
            UI.showToast("Tumpukan piring mini sudah penuh (5 piring)!");
            return;
        }
        this.learnStackPlates.push(nextColor);
        if (window.SoundManager) SoundManager.play('push');
        this.renderHandsOnStack();
        UI.showToast(\`Push: \${nextColor} diletakkan di puncak (TOP).\`);
    },

    handsOnPopPlate() {
        if (this.learnStackPlates.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Tumpukan piring kosong (Underflow)!");
            return;
        }
        const popped = this.learnStackPlates.pop();
        if (window.SoundManager) SoundManager.play('pop');
        this.renderHandsOnStack();
        UI.showToast(\`Pop: \${popped} diambil dari TOP. Prinsip LIFO terbukti!\`);
    },`;

const handsOnNew = `    recordMiniLabOp(opKey) {
        if (!window.StorageManager) return;
        if (!StorageManager.data.miniLabOps) {
            StorageManager.data.miniLabOps = {
                stackPush: false,
                stackPop: false,
                queueEnqueue: false,
                queueDequeue: false
            };
        }
        const wasNew = !StorageManager.data.miniLabOps[opKey];
        StorageManager.data.miniLabOps[opKey] = true;

        let doneCount = 0;
        if (StorageManager.data.miniLabOps.stackPush) doneCount++;
        if (StorageManager.data.miniLabOps.stackPop) doneCount++;
        if (StorageManager.data.miniLabOps.queueEnqueue) doneCount++;
        if (StorageManager.data.miniLabOps.queueDequeue) doneCount++;

        const miniScore = doneCount * 25;
        if (!StorageManager.data.pageScores) StorageManager.data.pageScores = {};
        StorageManager.data.pageScores['mini-lab'] = {
            score: miniScore,
            completed: doneCount === 4,
            savedAt: new Date().toISOString()
        };
        StorageManager.save();

        if (wasNew && window.UI) {
            UI.showToast(\`🧪 Praktik Mini-Lab Tercatat! Skor Praktik: \${miniScore}/100 pts (\${doneCount}/4 operasi selesai)\`);
        }
    },

    handsOnPushPlate() {
        const colors = ["Piring Biru", "Piring Kuning", "Piring Ungu", "Piring Oranye"];
        const nextColor = colors[this.learnStackPlates.length % colors.length];
        if (this.learnStackPlates.length >= 5) {
            UI.showToast("Kapasitas tumpukan piring penuh (Maks. 5 piring)! Hindari Stack Overflow.");
            return;
        }
        this.learnStackPlates.push(nextColor);
        if (window.SoundManager) SoundManager.play('push');
        this.renderHandsOnStack();
        this.recordMiniLabOp('stackPush');
        UI.showToast(\`Push: \${nextColor} diletakkan di puncak (TOP). Operasi Mini-Lab tercatat!\`);
    },

    handsOnPopPlate() {
        if (this.learnStackPlates.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Tumpukan piring kosong (Stack Underflow)!");
            return;
        }
        const popped = this.learnStackPlates.pop();
        if (window.SoundManager) SoundManager.play('pop');
        this.renderHandsOnStack();
        this.recordMiniLabOp('stackPop');
        UI.showToast(\`Pop: \${popped} diambil dari TOP. Prinsip LIFO terbukti!\`);
    },`;

if (!appJs.includes(handsOnOld)) {
  console.error('handsOnOld not found!');
  process.exit(1);
}
appJs = appJs.replace(handsOnOld, handsOnNew);
console.log('1. Updated handsOnPushPlate & handsOnPopPlate with recordMiniLabOp');

// 2. Update handsOnEnqueuePerson & handsOnDequeuePerson
const queueHandsOnOld = `    handsOnEnqueuePerson() {
        const avatars = ["👨‍💼", "👵", "🧒", "👱‍♀️"];
        const names = ["Rian", "Dewi", "Edo", "Maya"];
        const idx = this.learnQueuePeople.length % names.length;
        if (this.learnQueuePeople.length >= 5) {
            UI.showToast("Antrean mini sudah penuh (5 orang)!");
            return;
        }
        const newPerson = { name: names[idx], avatar: avatars[idx] };
        this.learnQueuePeople.push(newPerson);
        if (window.SoundManager) SoundManager.play('enqueue');
        this.renderHandsOnQueue();
        UI.showToast(\`Enqueue: \${newPerson.name} masuk di bagian REAR (paling belakang).\`);
    },

    handsOnDequeuePerson() {
        if (this.learnQueuePeople.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Antrean kosong (Underflow)!");
            return;
        }
        const dequeued = this.learnQueuePeople.shift();
        if (window.SoundManager) SoundManager.play('dequeue');
        this.renderHandsOnQueue();
        UI.showToast(\`Dequeue: \${dequeued.name} dilayani di FRONT. Prinsip FIFO terbukti!\`);
    },`;

const queueHandsOnNew = `    handsOnEnqueuePerson() {
        const avatars = ["👨‍💼", "👵", "🧒", "👱‍♀️"];
        const names = ["Rian", "Dewi", "Edo", "Maya"];
        const idx = this.learnQueuePeople.length % names.length;
        if (this.learnQueuePeople.length >= 5) {
            UI.showToast("Kapasitas antrean kasir penuh (Maks. 5 orang)! Hindari Queue Overflow.");
            return;
        }
        const newPerson = { name: names[idx], avatar: avatars[idx] };
        this.learnQueuePeople.push(newPerson);
        if (window.SoundManager) SoundManager.play('enqueue');
        this.renderHandsOnQueue();
        this.recordMiniLabOp('queueEnqueue');
        UI.showToast(\`Enqueue: \${newPerson.name} masuk di REAR (paling belakang). Operasi Mini-Lab tercatat!\`);
    },

    handsOnDequeuePerson() {
        if (this.learnQueuePeople.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Antrean kasir kosong (Queue Underflow)!");
            return;
        }
        const dequeued = this.learnQueuePeople.shift();
        if (window.SoundManager) SoundManager.play('dequeue');
        this.renderHandsOnQueue();
        this.recordMiniLabOp('queueDequeue');
        UI.showToast(\`Dequeue: \${dequeued.name} dilayani di FRONT. Prinsip FIFO terbukti!\`);
    },`;

if (!appJs.includes(queueHandsOnOld)) {
  console.error('queueHandsOnOld not found!');
  process.exit(1);
}
appJs = appJs.replace(queueHandsOnOld, queueHandsOnNew);
console.log('2. Updated handsOnEnqueuePerson & handsOnDequeuePerson');

// 3. Update addGroupMember max 6
const addMemberOld = `    addGroupMember() {
        this.syncIdentityFromDOM();
        if (this.groupProjectState.members.length >= 8) {
            if (window.UI) UI.showToast("Maksimal 8 anggota dalam satu kelompok!");
            return;
        }
        this.groupProjectState.members.push({ name: '', role: '🤝 Anggota Tim' });
        this.renderGroupMembersList();`;

const addMemberNew = `    addGroupMember() {
        this.syncIdentityFromDOM();
        if (this.groupProjectState.members.length >= 6) {
            if (window.UI) UI.showToast("Maksimal 6 anggota dalam satu kelompok sesuai petunjuk RPM UKIN!");
            return;
        }
        const defaultRoles = [
            '👑 Ketua / Koordinator Tim',
            '📝 Notulis / Perumus Masalah',
            '🧪 Operator Simulasi & Pengujian',
            '🔍 Analis Struktur Data',
            '⚙️ Perancang Solusi Algoritmik',
            '📢 Presenter / Juru Bicara'
        ];
        const nextRole = defaultRoles[this.groupProjectState.members.length] || '🤝 Anggota Tim';
        this.groupProjectState.members.push({ name: '', absen: '', role: nextRole });
        this.renderGroupMembersList();`;

if (!appJs.includes(addMemberOld)) {
  console.error('addMemberOld not found!');
  process.exit(1);
}
appJs = appJs.replace(addMemberOld, addMemberNew);
console.log('3. Updated addGroupMember to max 6');

// 4. Update onMemberEnterKey limit to 6
appJs = appJs.replace(
  'this.groupProjectState.members.length < 8',
  'this.groupProjectState.members.length < 6'
);
console.log('4. Updated onMemberEnterKey limit to 6');

// 5. Update renderGroupMembersList row template to include delete button
const rowOld = `                    <select class="gp-member-role-select" 
                            style="flex: 2; min-width: 180px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: #714236;"
                            onchange="App.updateMemberRole(\${idx}, this.value)">
                        \${selectOptions}
                    </select>
                </div>`;

const rowNew = `                    <select class="gp-member-role-select" 
                            style="flex: 2; min-width: 180px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: #714236;"
                            onchange="App.updateMemberRole(\${idx}, this.value)">
                        \${selectOptions}
                    </select>
                    \${this.groupProjectState.members.length > 1 ? \`
                        <button type="button" class="btn btn-outline" 
                                style="padding: 0.5rem 0.75rem; border: 1.5px solid #D8D4BC; color: #891A10; cursor: pointer; border-radius: 8px; font-size: 0.9rem;"
                                onclick="App.removeGroupMember(\${idx})" title="Hapus Anggota Ini">
                            🗑
                        </button>
                    \` : ''}
                </div>`;

if (!appJs.includes(rowOld)) {
  console.error('rowOld not found!');
  process.exit(1);
}
appJs = appJs.replace(rowOld, rowNew);
console.log('5. Added delete button to group member rows in js/app.js');

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Successfully written updated js/app.js!');

