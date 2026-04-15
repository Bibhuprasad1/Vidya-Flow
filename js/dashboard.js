/**
 * Dashboard Logic for School Monitoring System (Superior Edition)
 */

let currentSchool = null;

document.addEventListener('DOMContentLoaded', () => {
    const schoolId = getUrlParam('id') || 'SCH001';
    currentSchool = SCHOOLS_DATA.find(s => s.id === schoolId);

    if (!currentSchool) {
        document.getElementById('contentArea').innerHTML = `
            <div class="card" style="text-align:center; padding: 5rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger);"></i>
                <h2>Data Retrieval Error</h2>
                <p>The requested school record is not available in the state registry.</p>
                <a href="index.html" class="btn btn-primary" style="display:inline-flex; width:auto; margin-top:1rem;">Return Home</a>
            </div>
        `;
        return;
    }

    document.getElementById('schoolNameDisplay').textContent = currentSchool.name;
    
    // Entrance Animations
    gsap.from(".dashboard-top-bar", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".sidebar", { x: -60, opacity: 0, duration: 1.2, ease: "expo.out" });

    renderSection('overview');

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('activeSectionTitle').textContent = item.querySelector('span').textContent;
            renderSection(section);
        });
    });
});

function renderSection(section) {
    const container = document.getElementById('contentArea');
    
    // Smooth Transition Out
    gsap.to(container, { opacity: 0, y: 15, duration: 0.3, onComplete: () => {
        switch(section) {
            case 'overview': renderOverview(container); break;
            case 'attendance': renderAttendance(container); break;
            case 'teachers': renderTeachers(container); break;
            case 'students': renderStudents(container); break;
            case 'meals': renderMeals(container); break;
            case 'sports': renderSports(container); break;
            case 'facilities': renderFacilities(container); break;
        }
        // Smooth Transition In
        gsap.to(container, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    }});
}

function animateCounters() {
    document.querySelectorAll('.stat-info h3').forEach(counter => {
        const textValue = counter.textContent;
        const target = parseFloat(textValue);
        const isPercent = textValue.includes('%');
        let count = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCount = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 4); // OutQuart ease
            
            const currentCount = easedProgress * target;
            counter.textContent = (isPercent ? Math.floor(currentCount) + '%' : Math.floor(currentCount));
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = textValue;
            }
        };
        requestAnimationFrame(updateCount);
    });
}

function renderOverview(container) {
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card glass-effect gs-stat">
                <div class="stat-icon" style="background: rgba(37,99,235,0.1); color: var(--accent-600);"><i class="fas fa-users"></i></div>
                <div class="stat-info"><h3>${currentSchool.stats.totalStudents}</h3><p>Total Enrollment</p></div>
            </div>
            <div class="stat-card glass-effect gs-stat">
                <div class="stat-icon" style="background: rgba(5,150,105,0.1); color: var(--success);"><i class="fas fa-user-tie"></i></div>
                <div class="stat-info"><h3>${currentSchool.stats.totalTeachers}</h3><p>Faculty Members</p></div>
            </div>
            <div class="stat-card glass-effect gs-stat">
                <div class="stat-icon" style="background: rgba(217,119,6,0.1); color: var(--warning);"><i class="fas fa-calendar-check"></i></div>
                <div class="stat-info"><h3>${currentSchool.stats.attendanceRate}%</h3><p>Avg. Attendance</p></div>
            </div>
            <div class="stat-card glass-effect gs-stat">
                <div class="stat-icon" style="background: rgba(220,38,38,0.1); color: var(--danger);"><i class="fas fa-utensils"></i></div>
                <div class="stat-info"><h3>${currentSchool.stats.mealConsumption}%</h3><p>Nutrition Metric</p></div>
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="card glass-effect gs-card"><div class="card-title">Admission Growth</div><canvas id="enrollmentChart" height="200"></canvas></div>
            <div class="card glass-effect gs-card"><div class="card-title">Meal Quality index</div><canvas id="mealChart" height="200"></canvas></div>
        </div>
    `;

    animateCounters();
    gsap.from(".gs-stat", { scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" });
    gsap.from(".gs-card", { y: 30, opacity: 0, duration: 1, delay: 0.2, stagger: 0.3 });

    new Chart(document.getElementById('enrollmentChart'), { 
        type: 'line', 
        data: { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], datasets: [{ label: 'Students', data: [1100, 1150, 1180, 1200, 1230, currentSchool.stats.totalStudents], borderColor: '#2563eb', tension: 0.4, fill: true, backgroundColor: 'rgba(37,99,235,0.1)' }] }, 
        options: { plugins: { legend: { display: false } }, responsive: true }
    });
    new Chart(document.getElementById('mealChart'), { 
        type: 'doughnut', 
        data: { labels: ['Consumed', 'Wasted'], datasets: [{ data: [currentSchool.stats.mealConsumption, 100 - currentSchool.stats.mealConsumption], backgroundColor: ['#059669', '#f1f5f9'] }] }, 
        options: { cutout: '75%', plugins: { legend: { position: 'bottom' } } }
    });
}

function renderAttendance(container) {
    container.innerHTML = `<div class="card glass-effect gs-card"><div class="card-title">Class-wise Metric Analysis</div><div class="table-container"><table><thead><tr><th>Division</th><th>Enrolled</th><th>Present</th><th>Absent</th><th>Compliance</th></tr></thead><tbody id="attBody"></tbody></table></div></div>`;
    const rows = ['10A', '10B', '9A', '9B', '8A'].map(c => `<tr><td>Grade ${c}</td><td>120</td><td>115</td><td>5</td><td><span class="badge badge-success">98% Efficient</span></td></tr>`).join('');
    document.getElementById('attBody').innerHTML = rows;
    gsap.from("#attBody tr", { opacity: 0, x: -15, stagger: 0.1, duration: 0.5 });
}

function renderTeachers(container) {
    let teachersHtml = currentSchool.teachers.map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.subject}</td><td>${t.classes}</td><td><div class="rating-stars">${Array(Math.floor(t.rating)).fill('<i class="fas fa-star"></i>').join('')}</div></td><td><span class="badge badge-primary">View Portfolio</span></td></tr>`).join('');
    container.innerHTML = `<div class="card glass-effect gs-card"><div class="card-title">State Registered Faculty (${currentSchool.teachers.length} Active)</div><div class="table-container"><table><thead><tr><th>Name</th><th>Expertise</th><th>Classes</th><th>Rating</th><th>Actions</th></tr></thead><tbody id="teachBody">${teachersHtml}</tbody></table></div></div>`;
    gsap.from("#teachBody tr", { opacity: 0, y: 15, stagger: 0.05, duration: 0.4 });
}

function renderStudents(container) {
    const schoolStudents = STUDENTS_DATA.filter(s => s.schoolId === currentSchool.id);
    let studentsHtml = schoolStudents.map(s => `
        <tr onclick="window.location.href='profile.html?id=${s.id}'" style="cursor:pointer">
            <td><img src="${s.photo}" width="32" class="avatar-mini" style="border-radius:50%; vertical-align:middle; margin-right:8px;"> ${s.name}</td>
            <td>${s.class}</td>
            <td>${s.attendance}%</td>
            <td><span class="badge ${s.attendance > 85 ? 'badge-success' : 'badge-warning'}">${s.performance}</span></td>
            <td><i class="fas fa-arrow-right" style="color:var(--accent-500)"></i></td>
        </tr>
    `).join('');

    container.innerHTML = `<div class="card glass-effect gs-card"><div class="card-title">Student Population (${schoolStudents.length} Records)</div><div class="table-container"><table><thead><tr><th>Name</th><th>Grade</th><th>Attendance</th><th>Status</th><th></th></tr></thead><tbody id="stuBody">${studentsHtml}</tbody></table></div></div>`;
    gsap.from("#stuBody tr", { opacity: 0, x: -25, stagger: 0.02, duration: 0.2 });
}

function renderMeals(container) {
    const schoolStudents = STUDENTS_DATA.filter(s => s.schoolId === currentSchool.id);
    let mealRows = schoolStudents.map(s => {
        const lastMeal = s.meals[0] || { status: 'Unknown' };
        const statusClass = lastMeal.status.includes('Full') ? 'badge-success' : 
                          lastMeal.status.includes('Half') ? 'badge-warning' : 'badge-danger';
        return `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.class}</td>
                <td><span class="badge ${statusClass}">${lastMeal.status}</span></td>
                <td>${lastMeal.date}</td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="card glass-effect gs-card">
            <div class="card-title">
                <div>Daily Meal Consumption Log</div>
                <div style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">Real-time monitoring of student nutrition intake</div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>Student Name</th><th>Grade</th><th>Ration Status</th><th>Timestamp</th></tr>
                    </thead>
                    <tbody id="mealBody">
                        ${mealRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    gsap.from("#mealBody tr", { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 });
}

function renderSports(container) {
    let sportsHtml = currentSchool.sports.map(s => `
        <div class="card glass-effect gs-stat" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; min-height:160px;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--accent-600);">
                <i class="fas ${getSportIcon(s.name)}"></i>
            </div>
            <h4 style="margin:0.25rem 0;">${s.name}</h4>
            <span class="badge badge-primary" style="margin-bottom:0.75rem">${s.level} Level</span>
            <div style="font-size:1.5rem; font-weight:800;">${s.students} <small style="font-size:0.75rem; font-weight:400;">Participants</small></div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="section-header"><h2>Disciplines & Athletics</h2></div>
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
            ${sportsHtml}
        </div>
    `;
    gsap.from(".gs-stat", { scale: 0.7, opacity: 0, stagger: 0.1, duration: 0.5 });
}

function getSportIcon(name) {
    const icons = {
        "Cricket": "fa-baseball-bat-ball",
        "Football": "fa-soccer-ball",
        "Volleyball": "fa-volleyball",
        "Badminton": "fa-shuttlecock",
        "Basketball": "fa-basketball-ball",
        "Athletics": "fa-running"
    };
    return icons[name] || "fa-medal";
}

function renderFacilities(container) {
    const f = currentSchool.facilities;
    const items = [
        { label: 'Smart Lab', icon: 'fas fa-desktop', active: f.computerLab },
        { label: 'Nutrition Wing', icon: 'fas fa-utensils', active: f.midDayMeal },
        { label: 'Digital Library', icon: 'fas fa-book-reader', active: f.libraryAccess }
    ];
    let itemsHtml = items.map(item => `<div class="check-item gs-item ${item.active ? 'active' : ''}"><span><i class="${item.icon}"></i> ${item.label}</span><i class="fas ${item.active ? 'fa-check-circle' : 'fa-times-circle'}"></i></div>`).join('');
    container.innerHTML = `<div class="card glass-effect gs-card"><div class="card-title">Asset Deployment Status</div><div class="checklist">${itemsHtml}</div></div>`;
    gsap.from(".gs-item", { opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.5 });
}

