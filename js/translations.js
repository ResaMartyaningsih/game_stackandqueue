/**
 * translations.js
 * Centralized Bilingual Dictionary (Indonesian [Default] & English)
 * Daily Rush: Stack & Queue Adventure
 */

const translations = {
    id: {
        // App meta & Header
        appTitle: "DAILY RUSH",
        appSubtitle: "Petualangan Stack & Queue",
        welcomeTitle: "Selamat Datang di Daily Rush!",
        welcomeSubtitle: "Jelajahi dunia struktur data Stack & Queue melalui petualangan seru sehari-hari!",
        language: "Bahasa",
        soundOn: "Suara: Aktif",
        soundOff: "Suara: Senyap",

        // Navigation
        navHome: "Beranda",
        navLearn: "Belajar",
        navPlay: "Bermain",
        navPuzzle: "Puzzle",
        navChallenge: "Tantangan",
        navAchievements: "Prestasi",
        navResult: "Hasil Akhir",
        settings: "Pengaturan",
        resetProgress: "Reset Progres",
        confirmReset: "Apakah kamu yakin ingin mereset seluruh progres petualangan? Semua nilai dan capaian akan dimulai dari awal.",
        yesReset: "Ya, Reset",
        cancel: "Batal",

        // Player Profile & Splash
        whoAreYou: "Siapa Namamu?",
        namePlaceholder: "Ketik namamu di sini...",
        startAdventure: "Mulai Petualangan",
        greeting: "Halo, {name}! Siap berpetualang?",
        enterNameAlert: "Silakan masukkan namamu terlebih dahulu untuk memulai petualangan!",
        playerProfile: "Profil Petualang",
        adventureProgress: "Progres Petualangan",
        levelsCompleted: "Level Selesai",
        currentScore: "Total Skor",

        // World Map & Locations
        worldMapTitle: "Peta Petualangan Daily Rush",
        worldMapDesc: "Selesaikan setiap lokasi secara berurutan untuk membuka tantangan berikutnya!",
        locSchool: "Sekolah (Pengenalan)",
        locWarehouse: "Gudang Logistik (Simulasi Stack)",
        locCafeteria: "Kantin Sekolah (Simulasi Queue)",
        locLibrary: "Perpustakaan (Mini Game Stack)",
        locSupermarket: "Supermarket (Mini Game Queue)",
        locPuzzle: "Zona Puzzle (Asah Logika)",
        locTechLab: "Loket & Lab (Tantangan Nyata)",
        locArena: "Arena Juara (Tantangan Akhir)",
        statusCompleted: "SELESAI",
        statusAvailable: "BUKA",
        statusLocked: "TERKUNCI",
        levelNumber: "Level {num}",

        // General Game / Action Buttons
        btnContinue: "Lanjutkan",
        btnBack: "Kembali ke Beranda",
        btnNextLevel: "Level Selanjutnya",
        btnTryAgain: "Coba Lagi",
        btnHint: "Petunjuk",
        btnCheck: "Periksa Jawaban",
        btnReset: "Ulangi",
        btnReview: "Review Jawaban",
        btnPrint: "Cetak Hasil",
        btnPlayAgain: "Main Lagi",
        scoreLabel: "Skor:",
        timeLabel: "Waktu:",
        objectiveLabel: "Tujuan Pembelajaran:",
        instructionsLabel: "Instruksi:",

        // Character (Kiko) Dialogues
        kikoGreeting: "Hai! Aku Kiko, teman belajarmu. Ayo kita kuasai konsep Stack & Queue bersama!",
        kikoStackTip: "Ingat prinsip Stack: LIFO (Last In, First Out). Yang terakhir masuk, justru yang pertama keluar!",
        kikoQueueTip: "Ingat prinsip Queue: FIFO (First In, First Out). Yang pertama datang, dia yang pertama dilayani!",
        kikoCorrect: "Hebat sekali! Logikamu sangat tepat!",
        kikoWrong: "Jangan menyerah! Ingat kembali prinsip dasarnya ya.",
        kikoCompleteLevel: "Luar biasa! Satu lokasi berhasil kamu selesaikan!",

        // Section: Learn Stack
        learnStackTitle: "Memahami STACK (Tumpukan)",
        stackPrinciple: "Prinsip Utama: LIFO (Last In, First Out)",
        stackPrincipleDesc: "Elemen yang TERAKHIR dimasukkan adalah yang PERTAMA dikeluarkan.",
        stackRealLife: "Contoh Nyata: Tumpukan piring, tumpukan buku, tombol Undo, riwayat 'Back' di browser web.",
        stackVisualDemo: "Simulasi Visual Stack",
        stackTopLabel: "TOP (Puncak)",
        stackBottomLabel: "DASAR (Bottom)",
        stackEmptyNotice: "Tumpukan kosong! Tambahkan elemen baru dengan PUSH.",
        pushExplanation: "push(item): Menambahkan elemen baru tepat di bagian TOP (paling atas).",
        popExplanation: "pop(): Mengambil dan mengeluarkan elemen yang berada di bagian paling atas (TOP).",
        peekExplanation: "peek(): Melihat elemen teratas tanpa menghapusnya dari tumpukan.",
        isEmptyExplanation: "isEmpty(): Memeriksa apakah tumpukan sedang kosong atau ada isinya.",
        actionPush: "PUSH (Tambah)",
        actionPop: "POP (Ambil)",
        actionPeek: "PEEK (Lihat Atas)",
        actionClear: "CLEAR (Kosongkan)",
        selectItemToAdd: "Pilih Benda:",
        itemPlate: "Piring Bersih",
        itemBook: "Buku Pelajaran",
        itemBox: "Kardus Paket",
        itemTray: "Baki Makanan",
        stackStateTitle: "Status Stack (Data Sebenarnya):",
        stackTopIs: "Elemen TOP saat ini: {item}",
        stackSizeIs: "Jumlah elemen: {size}",
        stackIsEmpty: "Apakah kosong? {status}",

        // Section: Learn Queue
        learnQueueTitle: "Memahami QUEUE (Antrean)",
        queuePrinciple: "Prinsip Utama: FIFO (First In, First Out)",
        queuePrincipleDesc: "Elemen yang PERTAMA masuk adalah yang PERTAMA keluar/dilayani.",
        queueRealLife: "Contoh Nyata: Antrean kasir supermarket, antrean tiket bioskop, antrean kantin, antrean cetak printer.",
        queueVisualDemo: "Simulasi Visual Queue",
        queueFrontLabel: "FRONT (Depan / Keluar)",
        queueRearLabel: "REAR (Belakang / Masuk)",
        queueEmptyNotice: "Antrean kosong! Masukkan orang/data dengan ENQUEUE.",
        enqueueExplanation: "enqueue(item): Menambahkan elemen baru di posisi paling belakang (REAR).",
        dequeueExplanation: "dequeue(): Melayani dan mengeluarkan elemen yang berada di posisi paling depan (FRONT).",
        frontExplanation: "front(): Memeriksa elemen yang berada di paling depan antrean.",
        actionEnqueue: "ENQUEUE (Masuk)",
        actionDequeue: "DEQUEUE (Layani)",
        actionFront: "FRONT (Lihat Depan)",
        selectPersonToAdd: "Pilih Pelanggan:",
        personStudent: "Siswa Seragam",
        personTeacher: "Guru",
        personGrandma: "Nenek Ramah",
        personBoy: "Anak Ceria",
        queueStateTitle: "Status Queue (Data Sebenarnya):",
        queueFrontIs: "Elemen FRONT saat ini: {item}",
        queueRearIs: "Elemen REAR saat ini: {item}",
        queueSizeIs: "Panjang antrean: {size}",
        queueIsEmpty: "Apakah kosong? {status}",

        // Mini Games Titles & Subtitles
        gameSupermarketTitle: "Kasir Supermarket Rame",
        gameSupermarketDesc: "Layani pelanggan sesuai nomor antrean mereka! Gunakan prinsip FIFO.",
        gameCafeteriaTitle: "Kantin Makan Siang",
        gameCafeteriaDesc: "Siswa lapar berdatangan! Masukkan ke antrean dan layani yang datang pertama.",
        gameBooksTitle: "Rak Buku Perpustakaan",
        gameBooksDesc: "Bantu pustakawan mengambil buku yang diminta dengan mengeluarkan buku di atasnya terlebih dahulu!",
        gameWarehouseTitle: "Gudang Logistik Kontainer",
        gameWarehouseDesc: "Tumpuk dan bongkar kotak barang di lorong sempit menggunakan metode LIFO.",
        gamePrinterTitle: "Antrean Cetak Printer Kantor",
        gamePrinterDesc: "Dokumen masuk ke antrean cetak. Dokumen mana yang akan keluar pertama?",
        gameBrowserTitle: "Tombol Back Browser Web",
        gameBrowserDesc: "Jelajahi halaman web dan lihat bagaimana tombol Back mengingat riwayat dengan Stack.",

        // Mini Game 1: Supermarket
        serveNextCustomer: "Layani Pelanggan Depan (Dequeue)",
        customerArrived: "Pelanggan Baru Tiba (Enqueue)",
        supermarketGoal: "Tujuan: Layani 5 pelanggan tanpa melanggar urutan FIFO!",
        servedCount: "Pelanggan Terlayani: {current} / {target}",
        wrongCustomerServed: "Salah urutan! Pelanggan yang datang lebih awal (FRONT) harus dilayani duluan.",
        correctCustomerServed: "Bagus! Pelanggan terdepan dilayani sesuai prinsip FIFO.",

        // Mini Game 2: Cafeteria
        cafeteriaGoal: "Kelola antrean makan siang. Tambahkan siswa baru dan layani siswa paling depan.",
        cafeteriaServed: "Siswa Makan: {current} / {target}",

        // Mini Game 3: Books
        targetBookIs: "Target Guru: Ambil buku '{book}'!",
        deskTopBook: "Buku di atas meja: {book}",
        bookTargetFound: "Hebat! Kamu berhasil mengambil buku target dengan membuka buku di atasnya terlebih dahulu.",
        cannotReachBook: "Tidak bisa mengambil buku dari bawah! Harus mengambil buku paling atas (TOP) terlebih dahulu.",
        takeTopBook: "Ambil Buku Teratas (POP)",
        putBookBack: "Tumpuk Buku (PUSH)",

        // Mini Game 4: Warehouse
        warehouseGoal: "Susun 4 kotak kargo, lalu bongkar kotak teratas sesuai instruksi mandor!",
        pushBoxBtn: "Tumpuk Kotak (PUSH)",
        popBoxBtn: "Bongkar Kotak Teratas (POP)",

        // Mini Game 5: Printer
        printDocBtn: "Cetak Dokumen Terdepan (DEQUEUE)",
        addDocBtn: "Kirim Dokumen Baru (ENQUEUE)",
        printerPrinting: "Sedang mencetak: {doc}...",
        printerIdle: "Printer siap. Antrean cetak kosong.",

        // Mini Game 6: Browser
        visitGoogle: "Buka Google",
        visitYoutube: "Buka YouTube",
        visitLMS: "Buka LMS Sekolah",
        visitWikipedia: "Buka Wikipedia",
        clickBackBtn: "⬅ Klik Tombol BACK",
        currentWebPage: "Halaman Saat Ini:",
        browserStackStatus: "Riwayat URL (Stack):",

        // Puzzle Zone
        puzzleTitle: "Zona Puzzle Logika",
        puzzleADesc: "Puzzle A: Susun urutan orang dari yang DILAYANI PERTAMA sampai TERAKHIR (FIFO).",
        puzzleBDesc: "Puzzle B: Susun benda dari yang DIAMBIL PERTAMA sampai TERAKHIR dari tumpukan (LIFO).",
        puzzleCDesc: "Puzzle C: Tebak elemen mana yang akan keluar berikutnya jika operasi dipanggil!",
        puzzleDDesc: "Puzzle D: Pasangkan istilah dengan konsep yang sesuai (Tarik dan Lepas).",
        puzzleEDesc: "Puzzle E: Kelompokkan operasi method ke kotak STACK atau kotak QUEUE.",
        dropHere: "Letakkan di sini",
        puzzleSuccess: "Benar sekali! Seluruh pasangan tersusun dengan tepat!",
        puzzleIncorrect: "Masih ada susunan yang belum sesuai. Coba cek kembali prinsip LIFO dan FIFO!",

        // Challenge Arena
        challengeTitle: "Arena Tantangan Nyata",
        challengeQuestion: "Pertanyaan {current} dari {total}",
        questionScoreVal: "Poin Pertanyaan: +10",
        explanationTitle: "Penjelasan Konsep:",
        correctBadge: "BENAR!",
        wrongBadge: "BELUM TEPAT!",

        // Levels Data
        level1Title: "Level 1: Gerbang Logika Stack & Queue",
        level1Desc: "Pelajari dan pahami konsep dasar LIFO dan FIFO dalam kehidupan sehari-hari.",
        level2Title: "Level 2: Laboratorium Simulasi Stack",
        level2Desc: "Lakukan operasi push, pop, dan peek secara langsung pada simulator tumpukan.",
        level3Title: "Level 3: Laboratorium Simulasi Queue",
        level3Desc: "Kuasai operasi enqueue, dequeue, dan front pada simulator antrean.",
        level4Title: "Level 4: Tantangan Nyata Stack",
        level4Desc: "Bongkar muat kardus gudang dan temukan buku perpustakaan dengan LIFO.",
        level5Title: "Level 5: Tantangan Rame Antrean",
        level5Desc: "Kendalikan antrean kasir supermarket dan kantin sekolah dengan FIFO.",
        level6Title: "Level 6: Asah Otak di Zona Puzzle",
        level6Desc: "Tarik, pasangkan, dan urutkan elemen data structure pada berbagai skenario puzzle.",
        level7Title: "Level 7: Simulasi Kasus Nyata Tingkat Lanjut",
        level7Desc: "Pecahkan kasus printer spooler, riwayat browser back, dan tombol undo aplikasi.",
        level8Title: "Level 8: Evaluasi Akhir Juara Petualang",
        level8Desc: "Ujian komprehensif 10 soal untuk membuktikan penguasaan penuh Stack & Queue!",

        // Scoring & Predicates
        finalScoreTitle: "PETUALANGAN SELESAI!",
        finalScoreSubtitle: "Hasil Evaluasi Pembelajaran Struktur Data Siswa",
        playerNameLabel: "Nama Siswa",
        finalAverageScore: "Nilai Rata-Rata Akhir",
        predicateLabel: "Predikat Hasil:",
        predicateExcellent: "Sangat Baik",
        predicateGood: "Baik",
        predicateSatisfactory: "Cukup",
        predicateNeedsPractice: "Perlu Berlatih",
        predicateNeedsLearning: "Perlu Belajar Lagi",

        // Metrics
        metricAccuracy: "Akurasi Jawaban",
        metricCorrect: "Jawaban Benar",
        metricWrong: "Jawaban Salah",
        metricTime: "Waktu Bermain",
        levelScoresSummary: "Rincian Skor Tiap Level",

        // Concept Mastery
        masteredConceptsTitle: "Konsep yang Sudah Dikuasai",
        conceptsToPracticeTitle: "Konsep yang Perlu Dilatih Lagi",
        allMasteredNotice: "Luar biasa! Kamu telah menguasai seluruh konsep dasar Stack dan Queue dengan sempurna!",
        practiceStackNotice: "Latih kembali operasi Stack (push, pop, peek) dan pemahaman konsep LIFO.",
        practiceQueueNotice: "Latih kembali operasi Queue (enqueue, dequeue, front) dan pemahaman konsep FIFO.",

        // Review Answers Modal
        reviewModalTitle: "Review Jawaban & Pembahasan Lengkap",
        reviewFilterAll: "Semua Soal",
        reviewFilterCorrect: "Jawaban Benar",
        reviewFilterWrong: "Jawaban Perlu Koreksi",
        yourAnswer: "Jawabanmu:",
        correctAnswerIs: "Jawaban Benar:",
        conceptInvolved: "Konsep Terkait:",
        noQuestionsAnsweredYet: "Belum ada soal yang dijawab. Ayo selesaikan tantangan terlebih dahulu!",

        // Achievements
        achievementsTitle: "Piala & Prestasi Petualang",
        achievementUnlockedToast: "Prestasi Terbuka!",
        achFirstStepTitle: "Langkah Pertama (First Step)",
        achFirstStepDesc: "Selesaikan aktivitas atau level pertama dalam petualangan.",
        achStackMasterTitle: "Master Tumpukan (Stack Master)",
        achStackMasterDesc: "Kuasai seluruh aktivitas dan simulasi bertema Stack.",
        achQueueMasterTitle: "Master Antrean (Queue Master)",
        achQueueMasterDesc: "Kuasai seluruh aktivitas dan simulasi bertema Queue.",
        achPuzzleSolverTitle: "Pakar Teka-Teki (Puzzle Solver)",
        achPuzzleSolverDesc: "Selesaikan semua puzzle logika di Zona Puzzle.",
        achFastLearnerTitle: "Pelajar Kilat (Fast Learner)",
        achFastLearnerDesc: "Selesaikan tantangan dengan kecepatan tinggi dan akurasi di atas 80%.",
        achPerfectScoreTitle: "Nilai Sempurna (Perfect Score)",
        achPerfectScoreDesc: "Raih skor sempurna 100 poin pada salah satu level.",
        achGrandMasterTitle: "Juara Struktur Data (Grand Master)",
        achGrandMasterDesc: "Tuntaskan seluruh 8 level petualangan Daily Rush!",

        // Print Sheet
        printTitle: "LEMBAR LAPORAN EVALUASI SISWA",
        printSubject: "Mata Pelajaran: Informatika (Struktur Data Stack & Queue)",
        printTargetGrade: "Tingkat: SMA Kelas X (Fase E)",
        printDateLabel: "Tanggal Pelaksanaan:",
        printTeacherNotes: "Catatan Guru Pengampu:",
        printTeacherSign: "Tanda Tangan Guru",
        printStudentSign: "Tanda Tangan Siswa"
    },

    en: {
        // App meta & Header
        appTitle: "DAILY RUSH",
        appSubtitle: "Stack & Queue Adventure",
        welcomeTitle: "Welcome to Daily Rush!",
        welcomeSubtitle: "Explore the world of Stack & Queue data structures through exciting everyday adventures!",
        language: "Language",
        soundOn: "Sound: ON",
        soundOff: "Sound: Muted",

        // Navigation
        navHome: "Home",
        navLearn: "Learn",
        navPlay: "Mini Games",
        navPuzzle: "Puzzles",
        navChallenge: "Challenges",
        navAchievements: "Achievements",
        navResult: "Final Results",
        settings: "Settings",
        resetProgress: "Reset Progress",
        confirmReset: "Are you sure you want to reset all adventure progress? All scores and achievements will be reset.",
        yesReset: "Yes, Reset",
        cancel: "Cancel",

        // Player Profile & Splash
        whoAreYou: "What is your name?",
        namePlaceholder: "Type your name here...",
        startAdventure: "Start Adventure",
        greeting: "Hello, {name}! Ready for your adventure?",
        enterNameAlert: "Please enter your name first to begin the adventure!",
        playerProfile: "Adventurer Profile",
        adventureProgress: "Adventure Progress",
        levelsCompleted: "Levels Completed",
        currentScore: "Total Score",

        // World Map & Locations
        worldMapTitle: "Daily Rush Adventure Map",
        worldMapDesc: "Complete each location sequentially to unlock subsequent challenges!",
        locSchool: "School (Introduction)",
        locWarehouse: "Logistics Warehouse (Stack Sim)",
        locCafeteria: "School Cafeteria (Queue Sim)",
        locLibrary: "Library (Stack Mini-Game)",
        locSupermarket: "Supermarket (Queue Mini-Game)",
        locPuzzle: "Puzzle Zone (Logic Brain)",
        locTechLab: "Ticket Counter & Lab (Real Life)",
        locArena: "Champion Arena (Final Evaluation)",
        statusCompleted: "COMPLETED",
        statusAvailable: "AVAILABLE",
        statusLocked: "LOCKED",
        levelNumber: "Level {num}",

        // General Game / Action Buttons
        btnContinue: "Continue",
        btnBack: "Back to Home",
        btnNextLevel: "Next Level",
        btnTryAgain: "Try Again",
        btnHint: "Hint",
        btnCheck: "Check Answer",
        btnReset: "Restart",
        btnReview: "Review Answers",
        btnPrint: "Print Result",
        btnPlayAgain: "Play Again",
        scoreLabel: "Score:",
        timeLabel: "Time:",
        objectiveLabel: "Learning Objective:",
        instructionsLabel: "Instructions:",

        // Character (Kiko) Dialogues
        kikoGreeting: "Hi! I'm Kiko, your learning companion. Let's master Stack & Queue concepts together!",
        kikoStackTip: "Remember the Stack rule: LIFO (Last In, First Out). The last item added is the first one removed!",
        kikoQueueTip: "Remember the Queue rule: FIFO (First In, First Out). Whoever arrives first is served first!",
        kikoCorrect: "Awesome! Your logic is spot on!",
        kikoWrong: "Don't give up! Remember the core principle.",
        kikoCompleteLevel: "Incredible! You have cleared another location!",

        // Section: Learn Stack
        learnStackTitle: "Understanding STACK",
        stackPrinciple: "Core Principle: LIFO (Last In, First Out)",
        stackPrincipleDesc: "The item added LAST is the one removed FIRST.",
        stackRealLife: "Real-world examples: Stack of plates, stack of books, Undo button, browser 'Back' history.",
        stackVisualDemo: "Interactive Stack Visualizer",
        stackTopLabel: "TOP (Peak)",
        stackBottomLabel: "BOTTOM (Base)",
        stackEmptyNotice: "The stack is empty! Add new elements with PUSH.",
        pushExplanation: "push(item): Inserts a new element directly on the TOP of the stack.",
        popExplanation: "pop(): Removes and returns the element currently at the TOP.",
        peekExplanation: "peek(): Inspects the topmost element without removing it.",
        isEmptyExplanation: "isEmpty(): Checks whether the stack has zero items.",
        actionPush: "PUSH (Add)",
        actionPop: "POP (Remove)",
        actionPeek: "PEEK (View Top)",
        actionClear: "CLEAR (Reset)",
        selectItemToAdd: "Select Item:",
        itemPlate: "Clean Plate",
        itemBook: "Textbook",
        itemBox: "Parcel Box",
        itemTray: "Food Tray",
        stackStateTitle: "Stack State (Live Data Object):",
        stackTopIs: "Current TOP element: {item}",
        stackSizeIs: "Item count: {size}",
        stackIsEmpty: "Is empty? {status}",

        // Section: Learn Queue
        learnQueueTitle: "Understanding QUEUE",
        queuePrinciple: "Core Principle: FIFO (First In, First Out)",
        queuePrincipleDesc: "The item added FIRST is the one served/removed FIRST.",
        queueRealLife: "Real-world examples: Supermarket checkout line, cinema ticket line, school cafeteria, printer spooler.",
        queueVisualDemo: "Interactive Queue Visualizer",
        queueFrontLabel: "FRONT (Exit / Served)",
        queueRearLabel: "REAR (Entry / Waiting)",
        queueEmptyNotice: "The queue is empty! Add people/data with ENQUEUE.",
        enqueueExplanation: "enqueue(item): Inserts a new element at the very back (REAR).",
        dequeueExplanation: "dequeue(): Serves and removes the element at the very front (FRONT).",
        frontExplanation: "front(): Inspects the element currently at the front of the queue.",
        actionEnqueue: "ENQUEUE (Join Line)",
        actionDequeue: "DEQUEUE (Serve)",
        actionFront: "FRONT (View First)",
        selectPersonToAdd: "Select Customer:",
        personStudent: "Student",
        personTeacher: "Teacher",
        personGrandma: "Grandmother",
        personBoy: "Young Boy",
        queueStateTitle: "Queue State (Live Data Object):",
        queueFrontIs: "Current FRONT element: {item}",
        queueRearIs: "Current REAR element: {item}",
        queueSizeIs: "Queue length: {size}",
        queueIsEmpty: "Is empty? {status}",

        // Mini Games Titles & Subtitles
        gameSupermarketTitle: "Busy Supermarket Checkout",
        gameSupermarketDesc: "Serve shoppers according to their arrival ticket! Apply FIFO principle.",
        gameCafeteriaTitle: "School Cafeteria Rush",
        gameCafeteriaDesc: "Hungry students are arriving! Add to queue and serve the one who came first.",
        gameBooksTitle: "Library Book Stack",
        gameBooksDesc: "Help the librarian retrieve the requested book by popping books above it first!",
        gameWarehouseTitle: "Logistics Warehouse Cargo",
        gameWarehouseDesc: "Stack and unstack cargo containers in a tight bay using LIFO.",
        gamePrinterTitle: "Office Printer Spooler",
        gamePrinterDesc: "Print jobs enter the spooler. Which document prints out first?",
        gameBrowserTitle: "Browser Back Button",
        gameBrowserDesc: "Navigate through websites and watch how the Back button uses a Stack.",

        // Mini Game 1: Supermarket
        serveNextCustomer: "Serve Next Customer (Dequeue)",
        customerArrived: "New Customer Arrived (Enqueue)",
        supermarketGoal: "Goal: Serve 5 customers without violating FIFO order!",
        servedCount: "Served Customers: {current} / {target}",
        wrongCustomerServed: "Wrong order! The customer who arrived first (FRONT) must be served first.",
        correctCustomerServed: "Great! The front customer was served according to FIFO.",

        // Mini Game 2: Cafeteria
        cafeteriaGoal: "Manage cafeteria lunch line. Add new students and serve the front student.",
        cafeteriaServed: "Students Fed: {current} / {target}",

        // Mini Game 3: Books
        targetBookIs: "Teacher's Request: Retrieve '{book}'!",
        deskTopBook: "Top book on the desk: {book}",
        bookTargetFound: "Awesome! You retrieved the target book by taking the books on top first.",
        cannotReachBook: "Cannot pull books from underneath! You must remove the TOP book first.",
        takeTopBook: "Take Top Book (POP)",
        putBookBack: "Place Book (PUSH)",

        // Mini Game 4: Warehouse
        warehouseGoal: "Stack 4 cargo boxes, then unload the top box as instructed!",
        pushBoxBtn: "Stack Box (PUSH)",
        popBoxBtn: "Unload Top Box (POP)",

        // Mini Game 5: Printer
        printDocBtn: "Print Front Document (DEQUEUE)",
        addDocBtn: "Send New Document (ENQUEUE)",
        printerPrinting: "Now printing: {doc}...",
        printerIdle: "Printer idle. Spooler queue is empty.",

        // Mini Game 6: Browser
        visitGoogle: "Visit Google",
        visitYoutube: "Visit YouTube",
        visitLMS: "Visit School LMS",
        visitWikipedia: "Visit Wikipedia",
        clickBackBtn: "⬅ Click BACK Button",
        currentWebPage: "Current Page:",
        browserStackStatus: "URL History (Stack):",

        // Puzzle Zone
        puzzleTitle: "Logic Puzzle Zone",
        puzzleADesc: "Puzzle A: Arrange people in order from FIRST SERVED to LAST (FIFO).",
        puzzleBDesc: "Puzzle B: Arrange items in order from FIRST TAKEN to LAST from a stack (LIFO).",
        puzzleCDesc: "Puzzle C: Predict which element leaves next when an operation is executed!",
        puzzleDDesc: "Puzzle D: Match terms with their matching concept (Drag & Drop).",
        puzzleEDesc: "Puzzle E: Classify operations into the STACK box or the QUEUE box.",
        dropHere: "Drop here",
        puzzleSuccess: "Correct! All cards are arranged properly!",
        puzzleIncorrect: "Some cards are misplaced. Review LIFO and FIFO principles!",

        // Challenge Arena
        challengeTitle: "Real-Life Challenge Arena",
        challengeQuestion: "Question {current} of {total}",
        questionScoreVal: "Question Value: +10",
        explanationTitle: "Concept Explanation:",
        correctBadge: "CORRECT!",
        wrongBadge: "INCORRECT!",

        // Levels Data
        level1Title: "Level 1: Gate of Stack & Queue Logic",
        level1Desc: "Understand foundational LIFO and FIFO principles in everyday life.",
        level2Title: "Level 2: Stack Simulation Lab",
        level2Desc: "Perform push, pop, and peek operations on the live stack visualizer.",
        level3Title: "Level 3: Queue Simulation Lab",
        level3Desc: "Master enqueue, dequeue, and front operations on the queue visualizer.",
        level4Title: "Level 4: Real-World Stack Scenarios",
        level4Desc: "Handle warehouse cargo loading and library book retrieval with LIFO.",
        level5Title: "Level 5: Queue Rush Operations",
        level5Desc: "Manage supermarket checkout counters and school cafeteria lines with FIFO.",
        level6Title: "Level 6: Logic Brain Puzzle Zone",
        level6Desc: "Drag, match, and organize data structure elements across multiple puzzles.",
        level7Title: "Level 7: Advanced Real-Life Scenarios",
        level7Desc: "Solve printer spooling, web browser back histories, and undo commands.",
        level8Title: "Level 8: Grand Champion Assessment",
        level8Desc: "A comprehensive 10-question evaluation to prove your Stack & Queue mastery!",

        // Scoring & Predicates
        finalScoreTitle: "ADVENTURE COMPLETED!",
        finalScoreSubtitle: "Data Structure Student Evaluation Report",
        playerNameLabel: "Student Name",
        finalAverageScore: "Final Average Score",
        predicateLabel: "Performance Predicate:",
        predicateExcellent: "Excellent",
        predicateGood: "Good",
        predicateSatisfactory: "Satisfactory",
        predicateNeedsPractice: "Needs Practice",
        predicateNeedsLearning: "Needs More Learning",

        // Metrics
        metricAccuracy: "Answer Accuracy",
        metricCorrect: "Correct Answers",
        metricWrong: "Incorrect Answers",
        metricTime: "Total Play Time",
        levelScoresSummary: "Score Breakdown by Level",

        // Concept Mastery
        masteredConceptsTitle: "Mastered Concepts",
        conceptsToPracticeTitle: "Concepts to Practice",
        allMasteredNotice: "Incredible! You have mastered all foundational Stack and Queue concepts with flying colors!",
        practiceStackNotice: "Revisit Stack operations (push, pop, peek) and solidify the LIFO concept.",
        practiceQueueNotice: "Revisit Queue operations (enqueue, dequeue, front) and solidify the FIFO concept.",

        // Review Answers Modal
        reviewModalTitle: "Answer Review & Detailed Solutions",
        reviewFilterAll: "All Questions",
        reviewFilterCorrect: "Correct Answers",
        reviewFilterWrong: "Needs Correction",
        yourAnswer: "Your Answer:",
        correctAnswerIs: "Correct Answer:",
        conceptInvolved: "Related Concept:",
        noQuestionsAnsweredYet: "No questions answered yet. Clear some challenges first!",

        // Achievements
        achievementsTitle: "Adventurer Trophies & Badges",
        achievementUnlockedToast: "Achievement Unlocked!",
        achFirstStepTitle: "First Step",
        achFirstStepDesc: "Complete the very first activity or level in your adventure.",
        achStackMasterTitle: "Stack Master",
        achStackMasterDesc: "Master all Stack-themed activities and simulations.",
        achQueueMasterTitle: "Queue Master",
        achQueueMasterDesc: "Master all Queue-themed activities and simulations.",
        achPuzzleSolverTitle: "Puzzle Solver",
        achPuzzleSolverDesc: "Solve every logic puzzle in the Puzzle Zone.",
        achFastLearnerTitle: "Fast Learner",
        achFastLearnerDesc: "Complete challenges with high speed and over 80% accuracy.",
        achPerfectScoreTitle: "Perfect Score",
        achPerfectScoreDesc: "Score a perfect 100 points on any level.",
        achGrandMasterTitle: "Data Structure Grand Master",
        achGrandMasterDesc: "Complete all 8 adventure levels of Daily Rush!",

        // Print Sheet
        printTitle: "STUDENT EVALUATION REPORT CARD",
        printSubject: "Subject: Computer Science / Informatics (Stack & Queue)",
        printTargetGrade: "Grade: High School Grade 10 (Fase E)",
        printDateLabel: "Examination Date:",
        printTeacherNotes: "Teacher's Evaluation Notes:",
        printTeacherSign: "Teacher's Signature",
        printStudentSign: "Student's Signature"
    }
};

let currentLang = 'id';

function t(key, params = {}) {
    const dict = translations[currentLang] || translations.id;
    let text = dict[key] || translations.id[key] || key;

    // Replace dynamic placeholders {name}, {size}, etc.
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        if (window.StorageManager) {
            StorageManager.setSetting('language', lang);
        }
        applyLanguageToDOM();
    }
}

function getLanguage() {
    return currentLang;
}

function applyLanguageToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.innerHTML = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.placeholder = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            el.title = t(key);
        }
    });

    // Update active state on language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Notify listeners if app is initialized
    if (window.App && typeof window.App.onLanguageChanged === 'function') {
        window.App.onLanguageChanged(currentLang);
    }
}

// Universal attachment to window / global
if (typeof window !== 'undefined') {
    window.translations = translations;
    window.t = t;
    window.setLanguage = setLanguage;
    window.getLanguage = getLanguage;
    window.applyLanguageToDOM = applyLanguageToDOM;
}
if (typeof global !== 'undefined') {
    global.translations = translations;
    global.t = t;
    global.setLanguage = setLanguage;
    global.getLanguage = getLanguage;
    global.applyLanguageToDOM = applyLanguageToDOM;
}
