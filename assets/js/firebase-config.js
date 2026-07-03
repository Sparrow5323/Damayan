// Apply saved theme immediately to prevent flash
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode-pending');
        document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('dark-mode');
        });
    }
})();

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================
const firebaseConfig = {
    apiKey:            "AIzaSyAOlUuw170U6RiEiT2W2B63M3o1KJS25sQ",
    authDomain:        "barangay-damayang-lagi-1e600.firebaseapp.com",
    projectId:         "barangay-damayang-lagi-1e600",
    storageBucket:     "barangay-damayang-lagi-1e600.firebasestorage.app",
    messagingSenderId: "101144881920",
    appId:             "1:101144881920:web:10eea0c1723f4ecef7a1e5"
};

// Initialize Firebase (compat SDK — works with CDN script tags)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// =====================================================
// AUTH HELPERS
// =====================================================

function requireAuth(callback) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            redirectToRoot('index.html');
        } else {
            callback(user);
        }
    });
}

async function getCurrentUserProfile() {
    const user = auth.currentUser;
    if (!user) return null;
    const snap = await db.collection('users').doc(user.uid).get();
    return snap.exists ? { uid: user.uid, ...snap.data() } : null;
}

async function logout() {
    await auth.signOut();
    redirectToRoot('index.html');
}

// =====================================================
// UTILITY HELPERS
// =====================================================

function getRootPath() {
    // Dynamically get the root regardless of localhost subfolder or Netlify
    const parts = window.location.pathname.split('/').filter(Boolean);
    // On localhost: parts = ['website','dashboard'] → root is 2 up
    // On Netlify:   parts = ['dashboard']           → root is 1 up
    // On root:      parts = ['website'] or []       → root is current
    if (parts.length >= 2) {
        // Check if second-to-last part looks like a page folder
        return window.location.origin + '/' + parts.slice(0, -2).join('/') + (parts.length > 2 ? '/' : '/');
    }
    return window.location.origin + '/';
}

function redirectToRoot(path) {
    window.location.href = getRootPath() + path;
}

function showToast(msg, color = '#1e2a1c') {
    const existing = document.getElementById('toastMsg');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'toastMsg';
    el.className = 'toast-msg';
    el.style.background = color;
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function genRefNo(prefix = 'REF') {
    return prefix + '-' + Date.now().toString(36).toUpperCase();
}
