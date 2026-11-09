/**
 * firebase-config.js
 * Konfigurasi dan Inisialisasi Cloud Database Firebase Realtime Database
 * Menghubungkan Web Siswa (NalarQuest / LarasLogika) dan Portal Dashboard Guru
 */

const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDummyKeyForLarasLogikaMediaEdu2026",
    authDomain: "laraslogika-edu.firebaseapp.com",
    databaseURL: "https://laraslogika-edu-default-rtdb.firebaseio.com",
    projectId: "laraslogika-edu",
    storageBucket: "laraslogika-edu.appspot.com",
    messagingSenderId: "109876543210",
    appId: "1:109876543210:web:9876543210abcdef"
};

const FirebaseConfigManager = {
    STORAGE_KEY: 'laraslogika_firebase_config_custom',
    PIN_STORAGE_KEY: 'laraslogika_guru_pin',
    DEFAULT_PIN: '123456',

    getConfig() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.databaseURL) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Gagal membaca custom Firebase config:', e);
        }
        return DEFAULT_FIREBASE_CONFIG;
    },

    saveConfig(configObj) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configObj));
            return true;
        } catch (e) {
            console.error('Gagal menyimpan custom Firebase config:', e);
            return false;
        }
    },

    resetConfig() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (e) {
            return false;
        }
    },

    getTeacherPin() {
        try {
            return localStorage.getItem(this.PIN_STORAGE_KEY) || this.DEFAULT_PIN;
        } catch (e) {
            return this.DEFAULT_PIN;
        }
    },

    setTeacherPin(newPin) {
        try {
            localStorage.setItem(this.PIN_STORAGE_KEY, String(newPin).trim());
            return true;
        } catch (e) {
            return false;
        }
    },

    initApp() {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK belum dimuat di halaman ini.');
            return null;
        }

        const config = this.getConfig();
        try {
            if (!firebase.apps.length) {
                return firebase.initializeApp(config);
            } else {
                return firebase.app();
            }
        } catch (err) {
            console.warn('Inisialisasi Firebase fallback:', err);
            return null;
        }
    },

    getDatabase() {
        try {
            const app = this.initApp();
            if (app && typeof firebase.database === 'function') {
                return firebase.database();
            }
        } catch (e) {
            console.warn('Koneksi Realtime Database belum aktif:', e);
        }
        return null;
    }
};

window.FirebaseConfigManager = FirebaseConfigManager;
