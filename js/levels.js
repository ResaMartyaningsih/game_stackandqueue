/**
 * levels.js
 * Definitions and orchestration of the 8 major adventure levels
 */

const LEVELS_CONFIG = [
    {
        id: 1,
        titleKey: 'level1Title',
        descKey: 'level1Desc',
        icon: '🏫',
        locationNameKey: 'locSchool',
        type: 'intro-learning',
        targetTime: 90,
        objective: 'Pahami perbedaan mendasar LIFO (Stack) dan FIFO (Queue) melalui peragaan visual.'
    },
    {
        id: 2,
        titleKey: 'level2Title',
        descKey: 'level2Desc',
        icon: '📦',
        locationNameKey: 'locWarehouse',
        type: 'stack-sim',
        targetTime: 120,
        objective: 'Lakukan operasi push, pop, peek, dan amati status TOP pada simulator Stack sesungguhnya.'
    },
    {
        id: 3,
        titleKey: 'level3Title',
        descKey: 'level3Desc',
        icon: '🍽',
        locationNameKey: 'locCafeteria',
        type: 'queue-sim',
        targetTime: 120,
        objective: 'Kuasai operasi enqueue, dequeue, front, dan amati pergerakan FRONT antrean sesungguhnya.'
    },
    {
        id: 4,
        titleKey: 'level4Title',
        descKey: 'level4Desc',
        icon: '📚',
        locationNameKey: 'locLibrary',
        type: 'stack-games',
        targetTime: 150,
        objective: 'Selesaikan tantangan tumpukan buku perpustakaan dan muatan kargo gudang logistik.'
    },
    {
        id: 5,
        titleKey: 'level5Title',
        descKey: 'level5Desc',
        icon: '🛒',
        locationNameKey: 'locSupermarket',
        type: 'queue-games',
        targetTime: 150,
        objective: 'Layani kasir supermarket dan barisan kantin sekolah secara adil tanpa melanggar FIFO.'
    },
    {
        id: 6,
        titleKey: 'level6Title',
        descKey: 'level6Desc',
        icon: '🧩',
        locationNameKey: 'locPuzzle',
        type: 'puzzle-zone',
        targetTime: 180,
        objective: 'Pecahkan teka-teki drag-and-drop: penyusunan urutan elemen dan pengelompokan operasi.'
    },
    {
        id: 7,
        titleKey: 'level7Title',
        descKey: 'level7Desc',
        icon: '🎫',
        locationNameKey: 'locTechLab',
        type: 'tech-challenges',
        targetTime: 180,
        objective: 'Selesaikan studi kasus antrean cetak printer kantor dan riwayat tombol back browser.'
    },
    {
        id: 8,
        titleKey: 'level8Title',
        descKey: 'level8Desc',
        icon: '🏆',
        locationNameKey: 'locArena',
        type: 'final-exam',
        targetTime: 240,
        objective: 'Tuntaskan evaluasi akhir 10 soal skenario menantang untuk mendapatkan skor kelulusan petualangan!'
    }
];

const LevelsManager = {
    getAllLevels() {
        return LEVELS_CONFIG;
    },

    getLevel(levelId) {
        return LEVELS_CONFIG.find(l => l.id === Number(levelId));
    },

    isUnlocked(levelId) {
        return window.StorageManager ? StorageManager.isLevelUnlocked(levelId) : levelId === 1;
    },

    isCompleted(levelId) {
        if (!window.StorageManager) return false;
        return StorageManager.getLevelScore(levelId) !== null;
    },

    completeLevel(levelId, score) {
        if (window.StorageManager) {
            StorageManager.setLevelScore(levelId, score);
            // Unlock next level if available
            const nextLevel = Number(levelId) + 1;
            if (nextLevel <= LEVELS_CONFIG.length) {
                StorageManager.unlockLevel(nextLevel);
            }

            // Check achievements
            if (window.AchievementsManager) {
                AchievementsManager.check('FIRST_STEP');
                if (levelId === 2 || levelId === 4) {
                    if (StorageManager.getLevelScore(2) && StorageManager.getLevelScore(4)) {
                        AchievementsManager.check('STACK_MASTER');
                    }
                }
                if (levelId === 3 || levelId === 5) {
                    if (StorageManager.getLevelScore(3) && StorageManager.getLevelScore(5)) {
                        AchievementsManager.check('QUEUE_MASTER');
                    }
                }
                if (levelId === 6) {
                    AchievementsManager.check('PUZZLE_SOLVER');
                }
                // Check Grand Master if all 8 levels are finished
                const allScores = StorageManager.getAllLevelScores();
                if (Object.keys(allScores).length >= 8) {
                    AchievementsManager.check('GRAND_MASTER');
                }
            }
        }
    }
};

window.LevelsManager = LevelsManager;
window.LEVELS_CONFIG = LEVELS_CONFIG;
