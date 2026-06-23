<?php
$pageTitleKey = 'home';
$isHome = true;
require_once __DIR__ . '/includes/public-header.php';

// Dynamic homepage content
$hero     = Database::fetch("SELECT * FROM homepage_content WHERE section_key = 'hero'");
$whyUs    = Database::fetch("SELECT * FROM homepage_content WHERE section_key = 'why_us'");
$welcome  = Database::fetch("SELECT * FROM homepage_content WHERE section_key = 'welcome'");

// Real-time stats from database
$stats = [
    'patients'      => (int)(Database::fetch('SELECT COUNT(*) as c FROM customers')['c'] ?? 0),
    'dentists'      => (int)(Database::fetch('SELECT COUNT(*) as c FROM dentists WHERE is_active = 1')['c'] ?? 0),
    'services'      => (int)(Database::fetch('SELECT COUNT(*) as c FROM services WHERE is_active = 1')['c'] ?? 0),
    'appointments'  => (int)(Database::fetch("SELECT COUNT(*) as c FROM appointments WHERE status = 'completed'")['c'] ?? 0),
    'testimonials'  => (int)(Database::fetch('SELECT COUNT(*) as c FROM testimonials WHERE is_active = 1')['c'] ?? 0),
    'avg_rating'    => round((float)(Database::fetch('SELECT AVG(rating) as a FROM testimonials WHERE is_active = 1')['a'] ?? 5), 1),
];

// Content sections
$services     = Database::fetchAll("SELECT * FROM services WHERE is_featured = 1 AND is_active = 1 ORDER BY sort_order LIMIT 6");
$dentists     = Database::fetchAll("SELECT * FROM dentists WHERE is_active = 1 ORDER BY sort_order LIMIT 3");
$testimonials = Database::fetchAll("SELECT * FROM testimonials WHERE is_featured = 1 AND is_active = 1 LIMIT 6");
$blogs        = Database::fetchAll("SELECT * FROM blogs WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3");
$gallery      = Database::fetchAll("SELECT * FROM gallery ORDER BY sort_order LIMIT 8");

// Hero background: admin upload → homepage content → default clinic image
$heroBg = APP_URL . '/assets/images/bg.webp';
if ($img = setting('hero_image')) {
    $heroBg = upload_url($img);
} elseif (!empty($hero['image'])) {
    $heroBg = upload_url($hero['image']);
}

$whyBg = '';
if (!empty($gallery[1]['image'])) {
    $whyBg = upload_url($gallery[1]['image']);
} else {
    $whyBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80';
}

$siteName = Language::get() === 'ar' ? setting('site_name_ar') : setting('site_name');
?>

<!-- ═══════════ HERO ═══════════ -->
<section class="hero-section relative min-h-screen flex items-center overflow-hidden" id="hero">
    <!-- BG Image + overlays -->
    <div class="hero-bg absolute inset-0" style="background-image:url('<?= e($heroBg) ?>')" data-parallax="0.4"></div>
    <div class="hero-overlay absolute inset-0"></div>
    <div class="hero-mesh absolute inset-0"></div>

    <!-- Floating 3D orbs -->
    <div class="hero-orbs absolute inset-0 pointer-events-none overflow-hidden">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <!-- Particles canvas -->
    <canvas id="heroParticles" class="absolute inset-0 w-full h-full pointer-events-none opacity-60"></canvas>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div class="grid lg:grid-cols-2 gap-14 items-center">
            <!-- Text -->
            <div class="hero-text">
                <div class="reveal-up">
                    <span class="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <?= e(Language::get() === 'ar' ? setting('tagline_ar') : setting('tagline')) ?>
                    </span>
                </div>
                <h1 class="reveal-up delay-1 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6">
                    <?= e(Language::field($hero ?? [], 'title')) ?>
                </h1>
                <p class="reveal-up delay-2 text-lg md:text-xl text-blue-100/90 mb-4 leading-relaxed max-w-xl">
                    <?= e(Language::field($hero ?? [], 'subtitle')) ?>
                </p>
                <p class="reveal-up delay-2 text-sm text-blue-200/70 mb-8 max-w-lg">
                    <?= e(Language::field($hero ?? [], 'content')) ?>
                </p>
                <div class="reveal-up delay-3 flex flex-wrap gap-4">
                    <a href="<?= APP_URL ?>/contact.php" class="btn-glow text-lg px-8 py-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <?= e(Language::t('send_message')) ?>
                    </a>
                    <a href="<?= APP_URL ?>/contact.php" class="btn-glass text-lg px-8 py-4">
                        <?= e(Language::t('contact_us')) ?>
                    </a>
                </div>
            </div>

            <!-- 3D Hero Visual -->
            <div class="hidden lg:flex justify-center perspective-container reveal-up delay-4">
                <div class="tilt-card-3d hero-dental-card" id="hero3dCard">
                    <div class="hero-dental-glow" aria-hidden="true"></div>
                    <div class="hero-dental-orbit" aria-hidden="true"></div>
                    <div class="tilt-card-inner hero-dental-inner">
                        <img src="<?= APP_URL ?>/assets/images/hero.png" alt="<?= e(Language::t('hero_title')) ?>" class="tilt-card-img hero-dental-img">
                        <div class="tilt-card-shine"></div>
                        <div class="hero-dental-sparkles" aria-hidden="true">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <!-- Floating stat badges -->
                    <div class="float-badge float-badge-1 glass-card-dark">
                        <div class="text-2xl font-bold text-dental counter" data-target="<?= $stats['patients'] ?>">0</div>
                        <div class="text-xs text-gray-300"><?= e(Language::t('happy_patients')) ?></div>
                    </div>
                    <div class="float-badge float-badge-2 glass-card-dark">
                        <div class="flex items-center gap-1">
                            <span class="text-yellow-400 text-lg">★</span>
                            <span class="text-2xl font-bold text-white"><?= $stats['avg_rating'] ?></span>
                        </div>
                        <div class="text-xs text-gray-300"><?= e(Language::t('avg_rating')) ?></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
        <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div class="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
        </div>
    </div>
</section>

<!-- ═══════════ LIVE STATS BAR ═══════════ -->
<section class="stats-bar relative z-20 -mt-16 mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto">
    <div class="glass-card stats-grid rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-2xl">
        <?php
        $statItems = [
            ['patients',     display_stat($stats['patients'], 10000, '+'), Language::t('happy_patients'),  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'],
            ['dentists',     display_stat($stats['dentists'], 25, '+'),    Language::t('dental_specialists'), 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
            ['experience',   display_stat((int)setting('years_experience', '15'), 15, '+'), Language::t('years_experience'), 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['satisfaction', satisfaction_rate() . '%', Language::t('satisfaction_rate'), 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
        ];
        foreach ($statItems as $i => [$key, $display, $label, $icon]): ?>
        <div class="stat-item text-center reveal-up" style="--delay:<?= $i * 0.1 ?>s">
            <div class="stat-icon-wrap mx-auto mb-3">
                <svg class="w-6 h-6 text-dental" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?= $icon ?>"/></svg>
            </div>
            <div class="text-3xl md:text-4xl font-bold text-navy dark-text-heading"><?= e($display) ?></div>
            <div class="text-sm text-gray-500 dark-text-muted mt-1"><?= e($label) ?></div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- ═══════════ WELCOME ═══════════ -->
<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="reveal-left">
                <span class="text-dental font-semibold text-sm uppercase tracking-widest"><?= e($siteName) ?></span>
                <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title mt-2 mb-6"><?= e(Language::field($welcome ?? [], 'title')) ?></h2>
                <p class="text-gray-600 dark-text-muted text-lg leading-relaxed"><?= e(Language::field($welcome ?? [], 'content')) ?></p>
                <a href="<?= APP_URL ?>/about.php" class="inline-flex items-center gap-2 text-dental font-semibold mt-6 hover:gap-3 transition-all">
                    <?= e(Language::t('learn_more')) ?> <span>→</span>
                </a>
            </div>
            <div class="reveal-right">
                <div class="img-3d-frame">
                    <?php
                    $welcomeImg = !empty($gallery[3]['image']) ? upload_url($gallery[3]['image']) : 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80';
                    ?>
                    <img src="<?= e($welcomeImg) ?>" alt="" class="rounded-2xl w-full h-80 object-cover">
                    <div class="img-3d-shadow"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════ WHY CHOOSE US ═══════════ -->
<section class="section-pad section-bg-image relative" style="--section-bg:url('<?= e($whyBg) ?>')">
    <div class="section-bg-overlay"></div>
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 reveal-up">
            <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title mb-4"><?= e(Language::t('why_choose_us')) ?></h2>
            <p class="text-gray-600 dark-text-muted max-w-2xl mx-auto"><?= e(Language::field($whyUs ?? [], 'subtitle')) ?></p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php
            $features = [
                ['modern_equipment', 'modern_equipment_desc', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', '#E67E22'],
                ['expert_dentists', 'expert_dentists_desc', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', '#8B1E2D'],
                ['comfortable_care', 'comfortable_care_desc', 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', '#06B6D4'],
                ['affordable_prices', 'affordable_prices_desc', 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', '#8B5CF6'],
            ];
            foreach ($features as $i => $f): ?>
            <div class="feature-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.1 ?>s; --accent:<?= $f[3] ?>">
                <div class="feature-card-inner glass-card rounded-2xl p-8 text-center h-full">
                    <div class="feature-icon mx-auto mb-5">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?= $f[2] ?>"/></svg>
                    </div>
                    <h3 class="font-bold text-navy dark-text-heading mb-2"><?= e(Language::t($f[0])) ?></h3>
                    <p class="text-sm text-gray-500 dark-text-muted"><?= e(Language::t($f[1])) ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════ GALLERY MARQUEE ═══════════ -->
<?php if (!empty($gallery)): ?>
<section class="py-12 overflow-hidden bg-slate-100 dark-section-alt">
    <div class="gallery-marquee flex gap-4" id="galleryMarquee">
        <?php foreach (array_merge($gallery, $gallery) as $img): ?>
        <div class="marquee-item flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden">
            <img src="<?= e(upload_url($img['image'])) ?>" alt="<?= e(Language::field($img, 'title')) ?>" class="w-full h-full object-cover">
        </div>
        <?php endforeach; ?>
    </div>
</section>
<?php endif; ?>

<!-- ═══════════ FEATURED SERVICES ═══════════ -->
<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12 reveal-up">
            <div>
                <span class="text-dental text-sm font-semibold uppercase tracking-widest"><?= e(Language::t('our_services')) ?></span>
                <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title mt-1"><?= e(Language::t('featured_services')) ?></h2>
            </div>
            <a href="<?= APP_URL ?>/services.php" class="text-dental font-medium hover:underline hidden sm:block"><?= e(Language::t('view_all')) ?> →</a>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($services as $i => $service): ?>
            <div class="service-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.08 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                    <div class="service-img-wrap h-52 relative overflow-hidden">
                        <?php if ($service['image']): ?>
                        <img src="<?= e(upload_url($service['image'])) ?>" alt="" class="w-full h-full object-cover service-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-br from-dental-light to-dental/30 flex items-center justify-center">
                            <svg class="w-16 h-16 text-dental/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 3 1.5 4C7 12 5 14 5 17c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5 0-3-2-5-4-6.5 1-1 1.5-2.5 1.5-4C16.5 4 14.5 2 12 2z"/></svg>
                        </div>
                        <?php endif; ?>
                        <div class="service-price-tag"><?= format_price($service['price']) ?></div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <h3 class="font-bold text-navy dark-text-heading text-lg mb-2"><?= e(Language::field($service, 'name')) ?></h3>
                        <p class="text-sm text-gray-500 dark-text-muted mb-4 flex-1 line-clamp-2"><?= e(Language::field($service, 'description')) ?></p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100 dark-border">
                            <span class="text-xs text-gray-400"><?= $service['duration'] ?> <?= e(Language::t('minutes')) ?></span>
                            <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Service inquiry') ?>" class="text-dental text-sm font-semibold hover:underline"><?= e(Language::t('contact_us')) ?> →</a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════ DENTISTS ═══════════ -->
<section class="section-pad dark-section-alt">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 reveal-up">
            <span class="text-dental text-sm font-semibold uppercase tracking-widest"><?= e(Language::t('our_team')) ?></span>
            <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title mt-1"><?= e(Language::t('meet_dentists')) ?></h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <?php foreach ($dentists as $i => $d): ?>
            <div class="dentist-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.12 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden text-center group">
                    <div class="dentist-img-wrap h-64 relative overflow-hidden">
                        <?php if ($d['photo']): ?>
                        <img src="<?= e(upload_url($d['photo'])) ?>" alt="" class="w-full h-full object-cover dentist-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-b from-dental-light to-dental/20 flex items-center justify-center">
                            <span class="text-6xl font-bold text-dental/30"><?= e(substr($d['name'], 0, 1)) ?></span>
                        </div>
                        <?php endif; ?>
                        <div class="dentist-overlay">
                            <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Dentist inquiry') ?>" class="btn-glow text-sm py-2 px-5"><?= e(Language::t('contact_us')) ?></a>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-navy dark-text-heading text-lg"><?= e(Language::field($d, 'name')) ?></h3>
                        <p class="text-dental text-sm font-medium mt-1"><?= e(Language::field($d, 'specialization')) ?></p>
                        <p class="text-xs text-gray-400 mt-2"><?= e($d['experience']) ?> <?= e(Language::t('experience')) ?></p>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════ TESTIMONIALS ═══════════ -->
<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 reveal-up">
            <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title"><?= e(Language::t('patient_reviews')) ?></h2>
            <p class="text-gray-500 dark-text-muted mt-3"><?= $stats['testimonials'] ?>+ <?= e(Language::t('reviews_count')) ?></p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($testimonials as $i => $t): ?>
            <div class="testimonial-card reveal-up tilt-hover" style="--delay:<?= $i * 0.08 ?>s">
                <div class="glass-card rounded-2xl p-8 h-full relative">
                    <div class="text-5xl text-dental/20 absolute top-4 right-6 font-serif">"</div>
                    <div class="flex gap-0.5 mb-4">
                        <?php for ($r = 0; $r < $t['rating']; $r++): ?><span class="text-yellow-400 text-lg">★</span><?php endfor; ?>
                    </div>
                    <p class="text-gray-600 dark-text-muted mb-6 leading-relaxed relative z-10"><?= e(Language::field($t, 'review')) ?></p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-dental/10 flex items-center justify-center font-bold text-dental text-sm">
                            <?= e(substr($t['patient_name'], 0, 1)) ?>
                        </div>
                        <span class="font-semibold text-navy dark-text-heading text-sm"><?= e(Language::field($t, 'patient_name')) ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ═══════════ BLOG ═══════════ -->
<?php if (!empty($blogs)): ?>
<section class="section-pad dark-section-alt">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12 reveal-up">
            <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title"><?= e(Language::t('latest_blog')) ?></h2>
            <a href="<?= APP_URL ?>/blog.php" class="text-dental font-medium hover:underline"><?= e(Language::t('view_all')) ?> →</a>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <?php foreach ($blogs as $blog): ?>
            <a href="<?= APP_URL ?>/blog-detail.php?slug=<?= e($blog['slug']) ?>" class="blog-card-3d reveal-up tilt-hover block">
                <div class="glass-card rounded-2xl overflow-hidden h-full group">
                    <div class="h-48 overflow-hidden">
                        <?php if ($blog['featured_image']): ?>
                        <img src="<?= e(upload_url($blog['featured_image'])) ?>" alt="" class="w-full h-full object-cover blog-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-dental-light flex items-center justify-center"><svg class="w-12 h-12 text-dental/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg></div>
                        <?php endif; ?>
                    </div>
                    <div class="p-6">
                        <p class="text-xs text-dental mb-2"><?= $blog['published_at'] ? format_date($blog['published_at']) : '' ?></p>
                        <h3 class="font-bold text-navy dark-text-heading mb-2 group-hover:text-dental transition-colors"><?= e(Language::field($blog, 'title')) ?></h3>
                        <p class="text-sm text-gray-500 dark-text-muted line-clamp-2"><?= e(Language::field($blog, 'excerpt')) ?></p>
                    </div>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
