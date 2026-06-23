(function () {
    const STORAGE_KEY = 'adminTheme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        document.querySelectorAll('.theme-switch-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        if (typeof Chart !== 'undefined') {
            const isDark = theme === 'dark';
            Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
            Chart.defaults.borderColor = isDark ? '#334155' : '#e2e8f0';
            document.querySelectorAll('canvas').forEach(canvas => {
                const chart = Chart.getChart(canvas);
                if (chart) chart.update();
            });
        }

        window.dispatchEvent(new CustomEvent('admin-theme-change', { detail: { theme } }));
    }

    window.AdminTheme = { get: getPreferredTheme, set: applyTheme };

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(getPreferredTheme());

        document.querySelectorAll('.theme-switch-btn').forEach(btn => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });

        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('adminSidebarOverlay');
        const menuBtn = document.getElementById('adminMenuBtn');

        function closeSidebar() {
            sidebar?.classList.remove('open');
            overlay?.classList.remove('visible');
            document.body.style.overflow = '';
        }

        function openSidebar() {
            sidebar?.classList.add('open');
            overlay?.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }

        menuBtn?.addEventListener('click', () => {
            sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
        });
        overlay?.addEventListener('click', closeSidebar);

        sidebar?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) closeSidebar();
            });
        });

        document.querySelectorAll('[data-confirm]').forEach(el => {
            el.addEventListener('click', e => {
                if (!confirm(el.dataset.confirm || 'Are you sure?')) e.preventDefault();
            });
        });

        document.querySelectorAll('.admin-modal-overlay, [id^="modal-"]').forEach(modal => {
            if (!modal.classList.contains('admin-modal-overlay') && !modal.id?.startsWith('modal-')) return;
            modal.addEventListener('click', e => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        });

        document.querySelectorAll('.admin-step-form').forEach(form => {
            const panels = form.querySelectorAll('.admin-step-panel');
            const indicators = form.closest('.admin-crud-form-shell')?.querySelectorAll('.admin-step-indicator') || [];
            const btnBack = form.querySelector('.admin-step-back');
            const btnNext = form.querySelector('.admin-step-next');
            const btnSubmit = form.querySelector('.admin-step-submit');
            const total = panels.length;
            let current = 1;

            function showStep(n) {
                current = n;
                panels.forEach(p => p.classList.toggle('active', parseInt(p.dataset.step, 10) === n));
                indicators.forEach(ind => {
                    const s = parseInt(ind.dataset.step, 10);
                    ind.classList.toggle('active', s === n);
                    ind.classList.toggle('done', s < n);
                });
                btnBack?.classList.toggle('hidden', n <= 1);
                btnNext?.classList.toggle('hidden', n >= total);
                btnSubmit?.classList.toggle('hidden', n < total);
            }

            function validateStep(n) {
                const panel = form.querySelector('.admin-step-panel[data-step="' + n + '"]');
                if (!panel) return true;
                const required = panel.querySelectorAll('[required]');
                for (const el of required) {
                    if (!el.value.trim() && el.type !== 'file') {
                        el.focus();
                        el.reportValidity?.();
                        return false;
                    }
                    if (el.type === 'file' && el.required && !el.files?.length) {
                        el.reportValidity?.();
                        return false;
                    }
                }
                return true;
            }

            btnNext?.addEventListener('click', () => {
                if (validateStep(current) && current < total) showStep(current + 1);
            });
            btnBack?.addEventListener('click', () => {
                if (current > 1) showStep(current - 1);
            });
            showStep(1);
        });
    });
})();
