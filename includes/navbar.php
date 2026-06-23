<!-- Navigation -->
<nav class="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300" id="mainNav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 gap-4">
            <!-- Brand (left) -->
            <a href="<?= APP_URL ?>" class="flex items-center gap-3 group shrink-0 nav-brand min-w-0">
                <img src="<?= e(nav_logo_url()) ?>" alt="" class="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0">
                <div class="min-w-0 block max-w-[9rem] sm:max-w-none">
                    <span id="siteName" class="text-base sm:text-lg font-bold text-navy dark:text-white block leading-tight truncate"><?= e($siteName) ?></span>
                    <span id="siteTagline" class="text-xs text-dental truncate block"><?= e(Language::get() === 'ar' ? setting('tagline_ar') : setting('tagline')) ?></span>
                </div>
            </a>

            <!-- Nav links (center on desktop) -->
            <div class="hidden lg:flex flex-1 items-center justify-center gap-1">
                <?php foreach ($navMenu as $item): ?>
                    <?php if ($item['type'] === 'link'): ?>
                    <a href="<?= e($item['url']) ?>"
                       class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors <?= nav_link_class($item['page'], $currentPage) ?>">
                        <?= e($item['label']) ?>
                    </a>
                    <?php else: ?>
                    <div class="nav-dropdown relative" data-dropdown="<?= e($item['id']) ?>">
                        <button type="button" class="nav-dropdown-btn flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors <?= !empty($item['active']) ? 'text-dental bg-dental/10' : 'text-gray-600 dark:text-slate-300 hover:text-dental hover:bg-dental/5' ?>">
                            <?= e($item['label']) ?>
                            <svg class="w-4 h-4 nav-dropdown-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                        <div class="nav-dropdown-menu absolute top-full <?= Language::isRTL() ? 'right-0' : 'left-0' ?> mt-2 min-w-[200px] py-2 rounded-xl glass-card shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 z-50">
                            <?php foreach ($item['children'] as $child): ?>
                            <a href="<?= e($child['url']) ?>"
                               class="block px-4 py-2.5 text-sm font-medium transition-colors <?= nav_link_class($child['page'], $currentPage) ?>">
                                <?= e($child['label']) ?>
                            </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>

            <!-- Actions (right) -->
            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                <a href="<?= APP_URL ?>/contact.php" class="hidden md:inline-flex btn-primary text-sm py-2.5 px-5 nav-contact-btn">
                    <?= e(Language::t('contact_us')) ?>
                </a>
                <button id="mobileMenuBtn" type="button" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" aria-label="Menu">
                    <svg class="w-6 h-6 text-gray-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="lg:hidden hidden bg-white/95 dark:bg-slate-900/98 backdrop-blur-lg border-t dark:border-slate-700 max-h-[85vh] overflow-y-auto">
        <div class="px-4 py-4 space-y-1">
            <?php foreach ($navMenu as $item): ?>
                <?php if ($item['type'] === 'link'): ?>
                <a href="<?= e($item['url']) ?>"
                   class="block px-4 py-3 rounded-lg text-sm font-medium <?= nav_link_class($item['page'], $currentPage) ?>">
                    <?= e($item['label']) ?>
                </a>
                <?php else: ?>
                <div class="mobile-nav-group">
                    <button type="button" class="mobile-nav-toggle w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium <?= !empty($item['active']) ? 'text-dental bg-dental/10' : 'text-gray-600 dark:text-slate-300 hover:bg-dental/5' ?>" data-target="mob-<?= e($item['id']) ?>">
                        <?= e($item['label']) ?>
                        <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div id="mob-<?= e($item['id']) ?>" class="hidden <?= !empty($item['active']) ? '!block' : '' ?> pl-4 space-y-1 mt-1 mb-2">
                        <?php foreach ($item['children'] as $child): ?>
                        <a href="<?= e($child['url']) ?>"
                           class="block px-4 py-2.5 rounded-lg text-sm <?= nav_link_class($child['page'], $currentPage) ?>">
                            <?= e($child['label']) ?>
                        </a>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            <?php endforeach; ?>
            <div class="pt-3 mt-3 border-t dark:border-slate-700 space-y-1">
                <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"><?= Language::get() === 'ar' ? 'المزيد' : 'More' ?></p>
                <a href="<?= APP_URL ?>/testimonials.php" class="block px-4 py-2.5 rounded-lg text-sm <?= nav_link_class('testimonials', $currentPage) ?>"><?= e(Language::t('testimonials')) ?></a>
                <a href="<?= APP_URL ?>/faq.php" class="block px-4 py-2.5 rounded-lg text-sm <?= nav_link_class('faq', $currentPage) ?>"><?= e(Language::t('faq')) ?></a>
                <a href="<?= APP_URL ?>/contact.php" class="block btn-primary text-center mt-3"><?= e(Language::t('contact_us')) ?></a>
            </div>
        </div>
    </div>
</nav>
