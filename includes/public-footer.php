</main>

<?php $currentPage = $currentPage ?? current_page(); ?>
<?php
$footerSiteName = Language::get() === 'ar' ? setting('site_name_ar') : setting('site_name');
$footerTagline  = Language::get() === 'ar' ? setting('tagline_ar') : setting('tagline');
$footerAddress  = Language::get() === 'ar' ? setting('address_ar') : setting('address');
?>

<!-- Footer -->
<footer class="site-footer <?= !empty($isHome) ? 'mt-0' : 'mt-20' ?>">
    <?php if (empty($isHome)): ?>
    <div class="footer-cta">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="text-center md:text-start">
                <h3 class="text-xl md:text-2xl font-bold text-white mb-1">
                    <?= Language::get() === 'ar' ? 'جاهز لابتسامة أجمل؟' : 'Ready for a healthier smile?' ?>
                </h3>
                <p class="footer-cta-text text-sm"><?= e($footerTagline) ?></p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <a href="<?= e(whatsapp_url()) ?>" target="_blank" rel="noopener noreferrer" class="footer-cta-wa">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                </a>
                <a href="<?= APP_URL ?>/contact.php" class="btn-glow shrink-0"><?= e(Language::t('contact_us')) ?></a>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div class="footer-main">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                <!-- Brand -->
                <div class="lg:col-span-4">
                    <a href="<?= APP_URL ?>" class="footer-brand group">
                        <img src="<?= e(nav_logo_url()) ?>" alt="" class="footer-brand-logo">
                        <div class="min-w-0">
                            <span class="footer-brand-name"><?= e($footerSiteName) ?></span>
                            <span class="footer-brand-tagline"><?= e($footerTagline) ?></span>
                        </div>
                    </a>
                    <p class="footer-brand-desc">
                        <?= Language::get() === 'ar'
                            ? 'رعاية أسنان احترافية في بيئة مريحة وحديثة لابتسامة صحية ومشرقة.'
                            : 'Professional dental care in a modern, comfortable clinic for a healthy, confident smile.' ?>
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <?php
                        $socialIcons = [
                            'facebook'  => 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                            'instagram' => 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                            'twitter'   => 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                            'youtube'   => 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                        ];
                        foreach ($socialIcons as $social => $path):
                            if ($url = setting($social)):
                        ?>
                        <a href="<?= e($url) ?>" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="<?= ucfirst($social) ?>">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="<?= $path ?>"/></svg>
                        </a>
                        <?php endif; endforeach; ?>
                        <a href="<?= e(whatsapp_url()) ?>" target="_blank" rel="noopener noreferrer" class="footer-social footer-social-wa" aria-label="WhatsApp">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="lg:col-span-2">
                    <h4 class="footer-heading"><?= Language::get() === 'ar' ? 'روابط سريعة' : 'Quick Links' ?></h4>
                    <ul class="footer-links">
                        <li><a href="<?= APP_URL ?>/" class="<?= footer_link_class('index') ?>"><?= e(Language::t('home')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/about.php" class="<?= footer_link_class('about') ?>"><?= e(Language::t('about')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/services.php" class="<?= footer_link_class('services') ?>"><?= e(Language::t('services')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/dentists.php" class="<?= footer_link_class('dentists') ?>"><?= e(Language::t('dentists')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/contact.php" class="<?= footer_link_class('contact') ?>"><?= e(Language::t('contact')) ?></a></li>
                    </ul>
                </div>

                <!-- Explore -->
                <div class="lg:col-span-2">
                    <h4 class="footer-heading"><?= Language::get() === 'ar' ? 'استكشف' : 'Explore' ?></h4>
                    <ul class="footer-links">
                        <li><a href="<?= APP_URL ?>/gallery.php" class="<?= footer_link_class('gallery') ?>"><?= e(Language::t('gallery')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/blog.php" class="<?= footer_link_class('blog') ?>"><?= e(Language::t('blog')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/testimonials.php" class="<?= footer_link_class('testimonials') ?>"><?= e(Language::t('testimonials')) ?></a></li>
                        <li><a href="<?= APP_URL ?>/faq.php" class="<?= footer_link_class('faq') ?>"><?= e(Language::t('faq')) ?></a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="lg:col-span-4">
                    <h4 class="footer-heading"><?= e(Language::t('contact')) ?></h4>
                    <ul class="footer-contact space-y-4">
                        <?php if ($phone = setting('phone')): ?>
                        <li>
                            <span class="footer-contact-icon"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></span>
                            <div>
                                <p class="footer-contact-label"><?= e(Language::t('phone')) ?></p>
                                <a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $phone)) ?>" class="footer-contact-value"><?= e($phone) ?></a>
                            </div>
                        </li>
                        <?php endif; ?>
                        <li>
                            <span class="footer-contact-icon footer-contact-icon-wa"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>
                            <div>
                                <p class="footer-contact-label">WhatsApp</p>
                                <a href="<?= e(whatsapp_url()) ?>" target="_blank" rel="noopener noreferrer" class="footer-contact-value">+<?= e(whatsapp_number()) ?></a>
                            </div>
                        </li>
                        <?php if ($email = setting('email')): ?>
                        <li>
                            <span class="footer-contact-icon"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></span>
                            <div>
                                <p class="footer-contact-label"><?= e(Language::t('email')) ?></p>
                                <a href="mailto:<?= e($email) ?>" class="footer-contact-value"><?= e($email) ?></a>
                            </div>
                        </li>
                        <?php endif; ?>
                        <li>
                            <span class="footer-contact-icon"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
                            <div>
                                <p class="footer-contact-label"><?= Language::get() === 'ar' ? 'العنوان' : 'Address' ?></p>
                                <p class="footer-contact-value-text"><?= e($footerAddress) ?></p>
                                <a href="<?= e(google_maps_place_url()) ?>" target="_blank" rel="noopener noreferrer" class="footer-map-link">
                                    <?= Language::get() === 'ar' ? 'عرض على الخريطة' : 'View on map' ?> →
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p class="footer-copy">© <?= date('Y') ?> <?= e($footerSiteName) ?>. <?= e(Language::t('all_rights')) ?>.</p>
            <div class="flex flex-wrap items-center justify-center gap-4">
                <a href="<?= APP_URL ?>/contact.php" class="footer-bottom-link"><?= e(Language::t('contact_us')) ?></a>
                <a href="<?= APP_URL ?>/faq.php" class="footer-bottom-link"><?= e(Language::t('faq')) ?></a>
                <a href="<?= APP_URL ?>/admin/login.php" class="footer-bottom-link opacity-60"><?= Language::get() === 'ar' ? 'الإدارة' : 'Admin' ?></a>
            </div>
        </div>
    </div>
</footer>

<div class="fab-stack <?= Language::isRTL() ? 'left-6' : 'right-6' ?>">
    <?php include __DIR__ . '/fab-actions.php'; ?>
    <a href="<?= e(whatsapp_url()) ?>" target="_blank" rel="noopener noreferrer"
       class="floating-wa-btn fab-enter-wa fab-3d-tilt"
       title="WhatsApp" aria-label="WhatsApp">
        <span class="fab-pulse-ring wa-pulse-ring" aria-hidden="true"></span>
        <span class="fab-3d-face wa-3d-face">
            <span class="fab-shine"></span>
            <svg class="w-7 h-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </span>
    </a>
</div>

<script src="<?= APP_URL ?>/assets/js/main.js?v=<?= filemtime(APP_ROOT . '/assets/js/main.js') ?>"></script>
<?php if ($ga = setting('google_analytics')): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?= e($ga) ?>"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','<?= e($ga) ?>');</script>
<?php endif; ?>
<script>if('serviceWorker' in navigator){navigator.serviceWorker.register('<?= APP_URL ?>/sw.js?v=3').then(r=>r.update()).catch(()=>{});}</script>
</body>
</html>
