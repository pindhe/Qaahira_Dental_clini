<?php
/**
 * Reusable inner-page hero
 * Set before include: $heroTitle, $heroSubtitle, $heroBg (optional)
 */
$heroTitle    = $heroTitle ?? (isset($pageTitleKey) ? Language::t($pageTitleKey) : ($pageTitle ?? APP_NAME));
$heroSubtitle = $heroSubtitle ?? (Language::get() === 'ar' ? setting('tagline_ar') : setting('tagline'));
$heroBg       = $heroBg ?? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80';
?>
<section class="page-hero relative overflow-hidden">
    <div class="page-hero-bg absolute inset-0" style="background-image:url('<?= e($heroBg) ?>')"></div>
    <div class="page-hero-overlay absolute inset-0"></div>
    <div class="relative z-10 max-w-4xl mx-auto px-4 py-28 md:py-32 text-center">
        <div class="reveal-up visible">
            <span class="page-hero-badge inline-block px-4 py-1 rounded-full text-sm font-medium mb-5"><?= e(setting('site_name')) ?></span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"><?= e($heroTitle) ?></h1>
            <?php if ($heroSubtitle): ?>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto"><?= e($heroSubtitle) ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>
