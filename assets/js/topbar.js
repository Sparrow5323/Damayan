// Injects the shared top bar. Requires firebase-config.js to be loaded first.
function loadTopbar() {
    const el = document.getElementById('topbarMount');
    if (!el) return;
    el.innerHTML = `
        <div class="brand-header">
            <div class="brand-icon-small"><i class="fas fa-landmark"></i></div>
            <div>
                <div class="brand-title">Barangay Damayang Lagi</div>
                <div class="brand-subtitle">Management System · e-Services</div>
            </div>
        </div>
        <button class="logout-btn" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </button>`;
}

async function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) return;
    try {
        if (typeof auth !== 'undefined') await auth.signOut();
    } catch (e) { /* ignore */ }
    window.location.href = getRootPath() + 'index.html';
}
