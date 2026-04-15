/**
 * Student Profile Logic (Superior Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
    const studentId = getUrlParam('id') || 'STU001';
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    
    if (!student) {
        document.body.innerHTML = `
            <div style="text-align:center; padding: 10rem 2rem; font-family: 'Inter', sans-serif;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 2rem;"></i>
                <h2 style="color: var(--primary-900);">Student Profile Not Found</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">The record for ID ${studentId} is not in the current state registry.</p>
                <a href="index.html" style="color: var(--accent-600); text-decoration: none; font-weight: 600;">Return to Dashboard</a>
            </div>
        `;
        return;
    }

    const school = SCHOOLS_DATA.find(sc => sc.id === student.schoolId);

    // Identity Population
    document.getElementById('studentPhoto').src = student.photo;
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentSchoolMeta').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${school.name}, ${school.address}`;
    document.getElementById('studentClass').textContent = `Grade ${student.class}`;
    document.getElementById('studentPerf').textContent = student.performance;
    document.getElementById('qAttend').textContent = `${student.attendance}%`;
    document.getElementById('qMeal').textContent = student.meals[0]?.status || 'Full';
    document.getElementById('backToDash').href = `dashboard.html?id=${school.id}`;
    document.getElementById('attendPercentLabel').textContent = `${student.attendance}% Efficiency`;

    // Animations
    gsap.from(".gs-reveal", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".gs-card", { scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "back.out(1.7)" });

    setTimeout(() => {
        const bar = document.getElementById('attendProgressBar');
        bar.style.width = `${student.attendance}%`;
        if (student.attendance < 80) bar.style.backgroundColor = 'var(--warning)';
        if (student.attendance < 60) bar.style.backgroundColor = 'var(--danger)';
    }, 800);

    // Charts
    new Chart(document.getElementById('attendanceChart'), { 
        type: 'doughnut', 
        data: { labels: ['Present', 'Margin'], datasets: [{ data: [student.attendance, 100 - student.attendance], backgroundColor: ['#2563eb', '#f1f5f9'], borderWeight: 0 }] }, 
        options: { cutout: '85%', plugins: { legend: { display: false } } } 
    });

    new Chart(document.getElementById('marksChart'), { 
        type: 'bar', 
        data: { 
            labels: student.marks.map(m => m.subject), 
            datasets: [{ label: 'Proficiency Score', data: student.marks.map(m => m.score), backgroundColor: '#3b82f6', borderRadius: 8, barThickness: 20 }] 
        }, 
        options: { 
            indexAxis: 'y',
            scales: { x: { beginAtZero: true, max: 100, grid: { display: false } }, y: { grid: { display: false } } }, 
            plugins: { legend: { display: false } } 
        } 
    });

    // Tables
    const marksTable = document.querySelector('#marksTable tbody');
    student.marks.forEach(m => { 
        const tr = document.createElement('tr'); 
        const grade = m.score > 90 ? 'A+' : m.score > 80 ? 'A' : m.score > 70 ? 'B' : 'C';
        tr.innerHTML = `<td>${m.subject}</td><td><strong>${m.score}/100</strong></td><td><span class="badge ${m.score > 70 ? 'badge-success' : 'badge-warning'}">${grade} Proficiency</span></td>`; 
        marksTable.appendChild(tr); 
    });

    const mealTable = document.querySelector('#mealTable tbody');
    student.meals.forEach(meal => { 
        const tr = document.createElement('tr'); 
        tr.innerHTML = `<td>${meal.date}</td><td><span class="badge badge-success">${meal.status} Ration</span></td>`; 
        mealTable.appendChild(tr); 
    });

    // Extra
    document.getElementById('sportName').textContent = student.sports.name;
    document.getElementById('sportLevel').textContent = `${student.sports.level} Division`;
    document.getElementById('sportAchievement').textContent = student.sports.achievements;
    
    const hobbiesContainer = document.getElementById('hobbiesTags');
    student.hobbies.forEach(hobby => { 
        const span = document.createElement('span'); 
        span.className = 'tag'; 
        span.textContent = hobby; 
        hobbiesContainer.appendChild(span); 
    });
});

