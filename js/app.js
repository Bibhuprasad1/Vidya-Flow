/**
 * Common Logic for School Monitoring System
 */

function initSearchSuggestions(inputId, dropdownId, data, key, onSelect) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;
    input.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        dropdown.innerHTML = '';
        if (!val) { dropdown.style.display = 'none'; return; }
        const matches = data.filter(item => item[key].toLowerCase().includes(val));
        if (matches.length > 0) {
            matches.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = item[key];
                div.onclick = () => { input.value = item[key]; dropdown.style.display = 'none'; if (onSelect) onSelect(item); };
                dropdown.appendChild(div);
            });
            dropdown.style.display = 'block';
        } else { dropdown.style.display = 'none'; }
    });
    document.addEventListener('click', (e) => { if (e.target !== input && e.target !== dropdown) dropdown.style.display = 'none'; });
}

function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function getUrlParam(param) { const params = new URLSearchParams(window.location.search); return params.get(param); }

document.addEventListener('DOMContentLoaded', () => { initTheme(); });
