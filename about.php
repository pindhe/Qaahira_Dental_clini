<?php
$pageTitleKey = 'about';
require_once __DIR__ . '/includes/public-header.php';

$sections = Database::fetchAll('SELECT * FROM about_content ORDER BY id');
$dentists = Database::fetchAll('SELECT * FROM dentists WHERE is_active = 1 ORDER BY sort_order');
$gallery  = Database::fetch('SELECT image FROM gallery ORDER BY sort_order LIMIT 1');

$heroBg = !empty($gallery['image']) ? upload_url($gallery['image']) : 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'تعرف على قصتنا ومهمتنا ورؤيتنا' : 'Discover our story, mission, and vision';
$stats = [
    'dentists' => count($dentists),
    'years'    => 15,
    'patients' => (int)(Database::fetch('SELECT COUNT(*) as c FROM customers')['c'] ?? 0),
];
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<!-- Stats strip -->
<section class="stats-bar relative z-20 -mt-12 mx-4 sm:mx-6 lg:mx-8 max-w-5xl lg:mx-auto">
    <div class="glass-card rounded-2xl p-6 grid grid-cols-3 gap-4 text-center shadow-xl">
        <div class="reveal-up">
            <div class="text-2xl md:text-3xl font-bold text-navy dark-text-heading counter" data-target="<?= $stats['years'] ?>">0</div>
            <div class="text-xs text-gray-500 dark-text-muted"><?= Language::get() === 'ar' ? 'سنوات خبرة' : 'Years Experience' ?></div>
        </div>
        <div class="reveal-up">
            <div class="text-2xl md:text-3xl font-bold text-dental counter" data-target="<?= $stats['dentists'] ?>">0</div>
            <div class="text-xs text-gray-500 dark-text-muted"><?= e(Language::t('expert_dentists')) ?></div>
        </div>
        <div class="reveal-up">
            <div class="text-2xl md:text-3xl font-bold text-navy dark-text-heading counter" data-target="<?= max($stats['patients'], 100) ?>">0</div>
            <div class="text-xs text-gray-500 dark-text-muted"><?= e(Language::t('happy_patients')) ?></div>
        </div>
    </div>
</section>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <?php foreach ($sections as $i => $section):
            $icons = ['history' => '🏛️', 'mission' => '🎯', 'vision' => '👁️', 'achievements' => '🏆'];
            $icon = $icons[$section['section_key']] ?? '🦷';
        ?>
        <div class="grid lg:grid-cols-2 gap-12 items-center reveal-up" style="--delay:<?= $i * 0.1 ?>s">
            <div class="<?= $section['section_key'] === 'vision' ? 'lg:order-2' : '' ?>">
                <span class="text-dental text-sm font-semibold uppercase tracking-widest"><?= e(Language::field($section, 'title')) ?></span>
                <h2 class="text-3xl font-bold text-navy dark-text-heading section-title mt-2 mb-6"><?= e(Language::field($section, 'title')) ?></h2>
                <p class="text-gray-600 dark-text-muted text-lg leading-relaxed"><?= nl2br(e(Language::field($section, 'content'))) ?></p>
            </div>
            <div class="<?= $section['section_key'] === 'vision' ? 'lg:order-1' : '' ?>">
                <div class="feature-card-3d tilt-hover">
                    <div class="glass-card rounded-2xl p-12 text-center">
                        <div class="text-6xl mb-4"><?= $icon ?></div>
                        <p class="text-dental font-bold text-lg"><?= e(Language::get() === 'ar' ? setting('site_name_ar') : setting('site_name')) ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Team -->
<section class="section-pad dark-section-alt">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 reveal-up">
            <span class="text-dental text-sm font-semibold uppercase tracking-widest"><?= e(Language::t('our_team')) ?></span>
            <h2 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading section-title mt-1"><?= e(Language::t('meet_dentists')) ?></h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <?php foreach ($dentists as $i => $d): ?>
            <div class="dentist-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.1 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden text-center">
                    <div class="dentist-img-wrap h-56 relative overflow-hidden">
                        <?php if ($d['photo']): ?>
                        <img src="<?= e(upload_url($d['photo'])) ?>" alt="" class="w-full h-full object-cover dentist-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-b from-dental-light to-dental/20 flex items-center justify-center">
                            <span class="text-5xl font-bold text-dental/40"><?= e(substr($d['name'], 0, 1)) ?></span>
                        </div>
                        <?php endif; ?>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-navy dark-text-heading"><?= e(Language::field($d, 'name')) ?></h3>
                        <p class="text-dental text-sm font-medium mt-1"><?= e(Language::field($d, 'specialization')) ?></p>
                        <p class="text-xs text-gray-400 mt-2"><?= e($d['qualification']) ?></p>
                        <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Dentist inquiry') ?>" class="btn-primary text-sm mt-4 inline-block"><?= e(Language::t('contact_us')) ?></a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
