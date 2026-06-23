<?php
// Rendered inside .fab-stack (see public-footer.php)
?>
<!-- Floating quick actions (theme + language) -->
<div class="fab-widget fab-enter" id="fabWidget">
    <div class="fab-menu" id="fabMenu" aria-hidden="true">
        <button type="button" id="fabTheme" class="fab-child fab-child-theme fab-3d-tilt" aria-label="<?= Language::get() === 'ar' ? 'تغيير المظهر' : 'Toggle theme' ?>" title="<?= Language::get() === 'ar' ? 'الوضع الداكن / الفاتح' : 'Dark / Light mode' ?>">
            <span class="fab-child-face">
                <svg class="w-5 h-5 fab-icon-moon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                <svg class="w-5 h-5 fab-icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </span>
        </button>
        <a href="<?= e(Language::switchUrl()) ?>" class="fab-child fab-child-lang fab-3d-tilt" aria-label="<?= Language::get() === 'ar' ? 'تغيير اللغة' : 'Change language' ?>" title="<?= Language::get() === 'en' ? 'العربية' : 'English' ?>">
            <span class="fab-child-face">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
            </span>
        </a>
    </div>
    <button type="button" id="fabToggle" class="fab-main fab-3d-tilt" aria-label="<?= Language::get() === 'ar' ? 'خيارات سريعة' : 'Quick options' ?>" aria-expanded="false">
        <span class="fab-pulse-ring" aria-hidden="true"></span>
        <span class="fab-pulse-ring fab-pulse-ring--delay" aria-hidden="true"></span>
        <span class="fab-3d-face">
            <span class="fab-shine"></span>
            <svg class="w-6 h-6 fab-icon-open" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            <svg class="w-6 h-6 fab-icon-close hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </span>
    </button>
</div>
