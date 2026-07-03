// Injects the shared sidebar. Requires firebase-config.js to be loaded first.
function loadSidebar(activeTab) {
    // Get base path (works on localhost/website/ and Netlify root)
    const base = window.location.origin + window.location.pathname.split('/').slice(0, -2).join('/') + '/';
    
    const nav = [
        { tab: 'dashboard',    icon: 'fa-chart-pie',    label: 'Dashboard',      href: 'dashboard/dashboard.html' },
        { tab: 'services',     icon: 'fa-file-alt',     label: 'Services',       href: 'services/services.html' },
        { tab: 'announcement', icon: 'fa-bullhorn',     label: 'Announcement',   href: 'announcement/announcement.html' },
        { tab: 'calendar',     icon: 'fa-calendar-alt', label: 'Calendar Event', href: 'calendar/calendar.html' },
        { tab: 'residents',    icon: 'fa-users',        label: 'Residents',      href: 'residents/residents.html' },
        { tab: 'settings',     icon: 'fa-cog',          label: 'Settings',       href: 'settings/settings.html' },
        { tab: 'admin',        icon: 'fa-shield-alt',   label: 'Admin Panel',    href: 'admin/admin.html' },
    ];

    const el = document.getElementById('sidebarMount');
    if (!el) return;

    const user = auth.currentUser;
    const quickName = user ? (user.displayName || user.email.split('@')[0]) : '';

    el.innerHTML = `
        <div class="profile-summary" id="profileSummary" onclick="window.location.href='${base}dashboard/dashboard.html'">
            <div class="avatar-icon" id="sidebarAvatar"><i class="fas fa-user-circle"></i></div>
            <h3 id="sidebarName">${quickName}</h3>
            <span class="resident-id" id="sidebarRole"><i class="fas fa-id-badge"></i> Resident</span>
        </div>
        <div class="sidebar-nav">
            <ul id="sidebarNavList">
                ${nav.map(n => `
                <li class="nav-item ${n.tab === activeTab ? 'active' : ''}"
                    onclick="window.location.href='${base}${n.href}'">
                    <i class="fas ${n.icon}"></i> ${n.label}
                </li>`).join('')}
            </ul>
        </div>`;

    if (user) {
        db.collection('users').doc(user.uid).get().then(snap => {
            if (!snap.exists) return;
            const data = snap.data();

            const fullName = data.firstName
                ? `${data.firstName} ${data.lastName || ''}`.trim()
                : quickName;

            const isAdmin  = data.role === 'admin';
            const roleIcon = isAdmin ? 'fa-shield-alt' : 'fa-id-badge';
            const roleText = isAdmin ? 'Administrator' : 'Resident';

            document.getElementById('sidebarName').innerText = fullName;
            document.getElementById('sidebarRole').innerHTML =
                `<i class="fas ${roleIcon}"></i> ${roleText}`;

            const initials = ((data.firstName || '')[0] || '') +
                             ((data.lastName  || '')[0] || '');
            if (initials) {
                document.getElementById('sidebarAvatar').innerHTML =
                    `<span style="font-size:1.4rem;font-weight:700;color:#be185d;">${initials.toUpperCase()}</span>`;
            }

            if (!isAdmin) {
                document.querySelectorAll('#sidebarNavList .nav-item').forEach(li => {
                    if (li.innerText.trim().includes('Admin Panel')) li.style.display = 'none';
                });
            }
        }).catch(e => console.warn('Sidebar profile error:', e));
    }
}
