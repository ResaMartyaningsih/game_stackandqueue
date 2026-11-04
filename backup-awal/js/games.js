/**
 * games.js
 * Implementation of the 6 Real-Life Mini-Games
 * Powered by real Stack and Queue data structures
 */

const MiniGames = {
    // ---------------------------------------------
    // MINI-GAME 1: SUPERMARKET CHECKOUT (QUEUE FIFO)
    // ---------------------------------------------
    supermarket: {
        queue: new Queue(),
        servedCount: 0,
        targetServed: 5,
        customerIndex: 1,

        init() {
            this.queue = new Queue();
            this.servedCount = 0;
            this.customerIndex = 1;

            // Seed initial customers
            this.addCustomer("Budi", "👦", "Roti & Susu");
            this.addCustomer("Siti", "👩", "Buah Apel");
            this.addCustomer("Pak Joko", "👨", "Beras 5kg");
            this.render();
        },

        addCustomer(name, avatar, item) {
            const ticket = this.customerIndex++;
            const customer = { id: ticket, name, avatar, item };
            this.queue.enqueue(customer);
            if (window.SoundManager) SoundManager.play('enqueue');
            this.render();
        },

        serveNext() {
            if (this.queue.isEmpty()) {
                UI.showFeedback(false, t('queueEmptyNotice'), 'FIFO');
                return;
            }

            const served = this.queue.dequeue();
            this.servedCount++;
            if (window.SoundManager) SoundManager.play('dequeue');

            UI.showFeedback(true, `${t('correctCustomerServed')} (${served.name} #${served.id})`, 'FIFO');

            // Spawn next customer automatically if below target
            if (this.servedCount + this.queue.size() < this.targetServed + 2) {
                const presets = [
                    { name: "Dewi", avatar: "👧", item: "Cokelat" },
                    { name: "Doni", avatar: "👱‍♂️", item: "Sabun" },
                    { name: "Bu Rina", avatar: "🧕", item: "Sayuran" }
                ];
                const nextPreset = presets[(this.customerIndex) % presets.length];
                setTimeout(() => {
                    this.addCustomer(nextPreset.name, nextPreset.avatar, nextPreset.item);
                }, 800);
            }

            this.render(served);

            if (this.servedCount >= this.targetServed) {
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gameSupermarketTitle'), 100);
                }, 900);
            }
        },

        tryServeWrong(customer) {
            if (window.SoundManager) SoundManager.play('wrong');
            const frontCust = this.queue.front();
            UI.showFeedback(false, `${t('wrongCustomerServed')} ${frontCust.name} (#${frontCust.id}) berada di posisi FRONT!`, 'FIFO');
        },

        render(lastServed = null) {
            const lane = document.getElementById('supermarket-lane');
            const countEl = document.getElementById('supermarket-count');
            const frontInfo = document.getElementById('supermarket-front-info');
            if (!lane) return;

            if (countEl) {
                countEl.textContent = `${this.servedCount} / ${this.targetServed}`;
            }

            const items = this.queue.toArray();
            if (frontInfo) {
                frontInfo.textContent = items.length > 0 
                    ? `${items[0].name} (#${items[0].id})` 
                    : '-';
            }

            lane.innerHTML = items.map((cust, idx) => `
                <div class="customer-card ${idx === 0 ? 'is-front animate-bounce-subtle' : ''}" 
                     onclick="${idx === 0 ? 'MiniGames.supermarket.serveNext()' : 'MiniGames.supermarket.tryServeWrong()'}"
                     title="${idx === 0 ? 'FRONT - Klik untuk melayani' : 'Belum giliran - Mengikuti FIFO'}">
                    <span class="customer-ticket">#${cust.id}</span>
                    <span class="customer-avatar">${cust.avatar}</span>
                    <span class="customer-name">${cust.name}</span>
                    <span class="customer-item">${cust.item}</span>
                    ${idx === 0 ? '<span class="front-badge">FRONT</span>' : `<span class="rear-pos">${idx + 1}</span>`}
                </div>
            `).join('');

            if (items.length === 0) {
                lane.innerHTML = `<div class="empty-state">${t('queueEmptyNotice')}</div>`;
            }
        }
    },

    // ---------------------------------------------
    // MINI-GAME 2: SCHOOL CAFETERIA (QUEUE FIFO)
    // ---------------------------------------------
    cafeteria: {
        queue: new Queue(),
        servedCount: 0,
        targetServed: 4,

        init() {
            this.queue = new Queue();
            this.servedCount = 0;
            this.addStudent("Andi", "👦", "Nasi Goreng");
            this.addStudent("Bella", "👧", "Mie Ayam");
            this.addStudent("Chandra", "🧒", "Soto Ayam");
            this.render();
        },

        addStudent(name, avatar, meal) {
            const student = { name, avatar, meal, id: Date.now() % 1000 };
            this.queue.enqueue(student);
            if (window.SoundManager) SoundManager.play('enqueue');
            this.render();
        },

        serveMeal() {
            if (this.queue.isEmpty()) {
                UI.showFeedback(false, t('queueEmptyNotice'), 'FIFO');
                return;
            }
            const served = this.queue.dequeue();
            this.servedCount++;
            if (window.SoundManager) SoundManager.play('dequeue');

            UI.showFeedback(true, `Makanan disajikan ke ${served.name} (Prinsip FIFO: dilayani sesuai urutan kedatangan).`, 'FIFO');
            this.render();

            if (this.servedCount >= this.targetServed) {
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gameCafeteriaTitle'), 100);
                }, 800);
            }
        },

        render() {
            const line = document.getElementById('cafeteria-line');
            const countEl = document.getElementById('cafeteria-count');
            if (!line) return;

            if (countEl) countEl.textContent = `${this.servedCount} / ${this.targetServed}`;

            const items = this.queue.toArray();
            line.innerHTML = items.map((std, idx) => `
                <div class="cafeteria-student ${idx === 0 ? 'is-front' : ''}">
                    <div class="student-avatar">${std.avatar}</div>
                    <div class="student-info">
                        <strong>${std.name}</strong>
                        <small>🍽 ${std.meal}</small>
                    </div>
                    ${idx === 0 ? '<span class="status-tag front">GIRLAN DEPAN (FRONT)</span>' : '<span class="status-tag queue">Antre</span>'}
                </div>
            `).join('');

            if (items.length === 0) {
                line.innerHTML = `<div class="empty-state">${t('queueEmptyNotice')}</div>`;
            }
        }
    },

    // ---------------------------------------------
    // MINI-GAME 3: STACK OF BOOKS (STACK LIFO)
    // ---------------------------------------------
    books: {
        stack: new Stack(),
        deskStack: new Stack(),
        targetBook: "Buku IPA (Sains)",
        solved: false,

        init() {
            this.stack = new Stack();
            this.deskStack = new Stack();
            this.solved = false;
            // Push bottom to top: Matematika (bottom), Sejarah, IPA, Bahasa Indonesia (top)
            this.stack.push("Buku Matematika");
            this.stack.push("Buku Sejarah");
            this.stack.push("Buku IPA (Sains)");
            this.stack.push("Buku Bahasa Indonesia");
            this.render();
        },

        popTopToDesk() {
            if (this.stack.isEmpty()) return;
            const popped = this.stack.pop();
            this.deskStack.push(popped);
            if (window.SoundManager) SoundManager.play('pop');

            if (popped === this.targetBook) {
                this.solved = true;
                UI.showFeedback(true, t('bookTargetFound'), 'LIFO');
                this.render();
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gameBooksTitle'), 100);
                }, 900);
            } else {
                UI.showFeedback(true, `Buku '${popped}' diambil dari TOP dan dipindahkan ke meja sementara.`, 'LIFO');
                this.render();
            }
        },

        pushBackToStack() {
            if (this.deskStack.isEmpty()) return;
            const book = this.deskStack.pop();
            this.stack.push(book);
            if (window.SoundManager) SoundManager.play('push');
            UI.showFeedback(true, `Buku '${book}' ditumpuk kembali ke rak utama (PUSH).`, 'LIFO');
            this.render();
        },

        tryTakeDirectly(bookName) {
            const top = this.stack.peek();
            if (bookName !== top) {
                if (window.SoundManager) SoundManager.play('wrong');
                UI.showFeedback(false, `${t('cannotReachBook')} Saat ini buku paling atas adalah: ${top}.`, 'LIFO');
            } else {
                this.popTopToDesk();
            }
        },

        render() {
            const shelf = document.getElementById('books-shelf');
            const desk = document.getElementById('books-desk');
            const targetEl = document.getElementById('books-target');
            if (!shelf || !desk) return;

            if (targetEl) targetEl.textContent = this.targetBook;

            const shelfItems = this.stack.toArray();
            const deskItems = this.deskStack.toArray();

            // Render shelf from top to bottom
            shelf.innerHTML = shelfItems.slice().reverse().map((b, idx) => {
                const isTop = idx === 0;
                return `
                    <div class="book-card ${isTop ? 'is-top animate-pulse' : ''}" 
                         onclick="MiniGames.books.tryTakeDirectly('${b}')">
                        <span class="book-icon">📖</span>
                        <span class="book-title">${b}</span>
                        ${isTop ? '<span class="top-badge">TOP</span>' : ''}
                    </div>
                `;
            }).join('');

            desk.innerHTML = deskItems.slice().reverse().map((b, idx) => `
                <div class="book-card desk-book">
                    <span class="book-icon">📘</span>
                    <span class="book-title">${b}</span>
                    ${idx === 0 ? '<span class="top-badge">MEJA</span>' : ''}
                </div>
            `).join('');

            if (shelfItems.length === 0) {
                shelf.innerHTML = `<div class="empty-state">${t('stackEmptyNotice')}</div>`;
            }
        }
    },

    // ---------------------------------------------
    // MINI-GAME 4: WAREHOUSE BOXES (STACK LIFO)
    // ---------------------------------------------
    warehouse: {
        stack: new Stack(),
        targetBoxes: 4,

        init() {
            this.stack = new Stack();
            this.stack.push("Kotak A (Alat Tulis)");
            this.stack.push("Kotak B (Komputer)");
            this.render();
        },

        pushBox(boxLabel) {
            if (this.stack.size() >= 5) {
                UI.showFeedback(false, "Ruang tumpukan sudah maksimal (5 kotak)!", 'LIFO');
                return;
            }
            const label = boxLabel || `Kotak ${String.fromCharCode(65 + this.stack.size())} (Kargo Baru)`;
            this.stack.push(label);
            if (window.SoundManager) SoundManager.play('push');
            UI.showFeedback(true, `Operasi PUSH: ${label} diletakkan di puncak tumpukan (TOP).`, 'LIFO');
            this.render();

            if (this.stack.size() === this.targetBoxes) {
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gameWarehouseTitle'), 100);
                }, 900);
            }
        },

        popBox() {
            if (this.stack.isEmpty()) {
                UI.showFeedback(false, t('stackEmptyNotice'), 'LIFO');
                return;
            }
            const popped = this.stack.pop();
            if (window.SoundManager) SoundManager.play('pop');
            UI.showFeedback(true, `Operasi POP: ${popped} berhasil diturunkan dari posisi TOP (Prinsip LIFO).`, 'LIFO');
            this.render();
        },

        peekBox() {
            if (this.stack.isEmpty()) {
                UI.showFeedback(false, t('stackEmptyNotice'), 'LIFO');
                return;
            }
            const top = this.stack.peek();
            if (window.SoundManager) SoundManager.play('peek');
            UI.showFeedback(true, `Operasi PEEK: Kotak teratas saat ini adalah ${top}. Tumpukan tidak berkurang.`, 'LIFO');
        },

        render() {
            const bay = document.getElementById('warehouse-bay');
            const stateEl = document.getElementById('warehouse-state');
            if (!bay) return;

            const items = this.stack.toArray();
            if (stateEl) {
                stateEl.textContent = `Ukuran Tumpukan: ${this.stack.size()} | TOP: ${this.stack.peek() || '-'}`;
            }

            bay.innerHTML = items.slice().reverse().map((b, idx) => `
                <div class="warehouse-box ${idx === 0 ? 'is-top animate-bounce-subtle' : ''}">
                    <span class="box-icon">📦</span>
                    <span class="box-name">${b}</span>
                    ${idx === 0 ? '<span class="top-badge">TOP (Puncak)</span>' : ''}
                </div>
            `).join('');

            if (items.length === 0) {
                bay.innerHTML = `<div class="empty-state">${t('stackEmptyNotice')}</div>`;
            }
        }
    },

    // ---------------------------------------------
    // MINI-GAME 5: PRINTER SPOOLER (QUEUE FIFO)
    // ---------------------------------------------
    printer: {
        queue: new Queue(),
        printedCount: 0,
        targetPrint: 3,

        init() {
            this.queue = new Queue();
            this.printedCount = 0;
            this.queue.enqueue({ title: "Soal Ujian Matematika.pdf", pages: 4, sender: "Pak Guru" });
            this.queue.enqueue({ title: "Sertifikat Lomba.pdf", pages: 1, sender: "Panitia" });
            this.queue.enqueue({ title: "Laporan Praktikum.pdf", pages: 8, sender: "Siswa" });
            this.render();
        },

        enqueueDoc(title, pages, sender) {
            this.queue.enqueue({ title, pages, sender });
            if (window.SoundManager) SoundManager.play('enqueue');
            UI.showFeedback(true, `Dokumen baru '${title}' masuk ke antrean printer di bagian REAR.`, 'FIFO');
            this.render();
        },

        printNext() {
            if (this.queue.isEmpty()) {
                UI.showFeedback(false, t('printerIdle'), 'FIFO');
                return;
            }
            const doc = this.queue.dequeue();
            this.printedCount++;
            if (window.SoundManager) SoundManager.play('dequeue');

            UI.showFeedback(true, `Mencetak '${doc.title}' (${doc.pages} halaman). Dilayani secara FIFO!`, 'FIFO');
            this.render(doc);

            if (this.printedCount >= this.targetPrint) {
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gamePrinterTitle'), 100);
                }, 900);
            }
        },

        render(printedDoc = null) {
            const list = document.getElementById('printer-queue-list');
            const statusEl = document.getElementById('printer-status-bar');
            if (!list) return;

            if (statusEl) {
                statusEl.textContent = printedDoc 
                    ? `Baru saja dicetak: ${printedDoc.title}` 
                    : (this.queue.isEmpty() ? t('printerIdle') : `Siap cetak. Dokumen FRONT: ${this.queue.front().title}`);
            }

            const items = this.queue.toArray();
            list.innerHTML = items.map((doc, idx) => `
                <div class="print-job-card ${idx === 0 ? 'is-front animate-pulse' : ''}">
                    <span class="job-icon">🖨</span>
                    <div class="job-details">
                        <strong>${doc.title}</strong>
                        <small>Pengirim: ${doc.sender} (${doc.pages} hlm)</small>
                    </div>
                    ${idx === 0 ? '<span class="status-tag front">FRONT (Cetak Sekarang)</span>' : `<span class="status-tag queue">Antrean #${idx + 1}</span>`}
                </div>
            `).join('');

            if (items.length === 0) {
                list.innerHTML = `<div class="empty-state">${t('queueEmptyNotice')}</div>`;
            }
        }
    },

    // ---------------------------------------------
    // MINI-GAME 6: BROWSER BACK BUTTON (STACK LIFO)
    // ---------------------------------------------
    browser: {
        stack: new Stack(),
        currentPage: "Halaman Beranda Sekolah",

        init() {
            this.stack = new Stack();
            this.currentPage = "Portal Siswa";
            this.stack.push("https://google.com");
            this.stack.push("https://youtube.com");
            this.stack.push("https://wikipedia.org");
            this.render();
        },

        visit(url) {
            // Push current page to history stack
            this.stack.push(this.currentPage);
            this.currentPage = url;
            if (window.SoundManager) SoundManager.play('push');
            UI.showFeedback(true, `Membuka '${url}'. URL sebelumnya disimpan ke Stack riwayat (PUSH).`, 'LIFO');
            this.render();
        },

        goBack() {
            if (this.stack.isEmpty()) {
                UI.showFeedback(false, "Tidak ada riwayat halaman web tersisa di Stack!", 'LIFO');
                return;
            }
            const previous = this.stack.pop();
            this.currentPage = previous;
            if (window.SoundManager) SoundManager.play('pop');
            UI.showFeedback(true, `Tombol BACK ditekan: Mengambil URL teratas dari Stack (POP) -> Membuka '${previous}'. Ini prinsip LIFO!`, 'LIFO');
            this.render();

            if (this.stack.size() === 0) {
                setTimeout(() => {
                    UI.showMiniGameSuccess(t('gameBrowserTitle'), 100);
                }, 900);
            }
        },

        render() {
            const historyList = document.getElementById('browser-history-stack');
            const urlBar = document.getElementById('browser-current-url');
            if (!historyList || !urlBar) return;

            urlBar.textContent = this.currentPage;

            const items = this.stack.toArray();
            historyList.innerHTML = items.slice().reverse().map((url, idx) => `
                <div class="browser-stack-item ${idx === 0 ? 'is-top' : ''}">
                    <span class="url-text">${url}</span>
                    ${idx === 0 ? '<span class="top-badge">TOP (Akan dibuka saat Back)</span>' : ''}
                </div>
            `).join('');

            if (items.length === 0) {
                historyList.innerHTML = `<div class="empty-state">${t('stackEmptyNotice')}</div>`;
            }
        }
    }
};

window.MiniGames = MiniGames;
