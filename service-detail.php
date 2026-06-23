<?php
require_once __DIR__ . '/includes/bootstrap-public.php';

$slug = $_GET['slug'] ?? '';
$service = Database::fetch(
    'SELECT s.*, c.name as category_name, c.name_ar as category_name_ar
     FROM services s LEFT JOIN service_categories c ON s.category_id = c.id
     WHERE s.slug = ? AND s.is_active = 1',
    [$slug]
);

if (!$service) {
    redirect(APP_URL . '/services.php');
}

$pageTitle = Language::field($service, 'name');
$metaDescription = mb_substr(strip_tags(Language::field($service, 'description')), 0, 160);
$heroTitle = $pageTitle;
$heroSubtitle = Language::get() === 'ar' ? ($service['category_name_ar'] ?? '') : ($service['category_name'] ?? '');
$heroBg = $service['image'] ? upload_url($service['image']) : 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1920&q=80';

require_once __DIR__ . '/includes/public-header.php';
require __DIR__ . '/includes/page-hero.php';

$faqs = Database::fetchAll('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order LIMIT 4');
$related = Database::fetchAll(
    'SELECT * FROM services WHERE is_active = 1 AND id != ? AND category_id = ? ORDER BY sort_order LIMIT 3',
    [$service['id'], $service['category_id']]
);
?>

<section class="section-pad pt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="text-sm text-gray-500 dark-text-muted mb-8 reveal-up">
            <a href="<?= APP_URL ?>" class="hover:text-dental"><?= e(Language::t('home')) ?></a>
            <span class="mx-2">/</span>
            <a href="<?= APP_URL ?>/services.php" class="hover:text-dental"><?= e(Language::t('services')) ?></a>
            <span class="mx-2">/</span>
            <span class="text-navy dark-text-heading"><?= e(Language::field($service, 'name')) ?></span>
        </nav>

        <div class="grid lg:grid-cols-2 gap-12 mb-16">
            <div class="reveal-left">
                <?php if ($service['image']): ?>
                <div class="img-3d-frame rounded-2xl overflow-hidden mb-6">
                    <img src="<?= e(upload_url($service['image'])) ?>" alt="" class="w-full h-80 object-cover">
                </div>
                <?php endif; ?>
                <?php if ($service['before_image'] || $service['after_image']): ?>
                <div class="grid grid-cols-2 gap-4">
                    <?php if ($service['before_image']): ?>
                    <div>
                        <p class="text-xs font-semibold text-gray-500 mb-2 uppercase"><?= e(Language::t('before_after')) ?> — Before</p>
                        <img src="<?= e(upload_url($service['before_image'])) ?>" alt="" class="rounded-xl w-full h-40 object-cover">
                    </div>
                    <?php endif; ?>
                    <?php if ($service['after_image']): ?>
                    <div>
                        <p class="text-xs font-semibold text-gray-500 mb-2 uppercase"><?= e(Language::t('before_after')) ?> — After</p>
                        <img src="<?= e(upload_url($service['after_image'])) ?>" alt="" class="rounded-xl w-full h-40 object-cover gallery-item cursor-pointer">
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
            <div class="reveal-right">
                <?php if ($service['category_name']): ?>
                <span class="text-dental text-sm font-semibold uppercase tracking-widest"><?= e(Language::get() === 'ar' ? $service['category_name_ar'] : $service['category_name']) ?></span>
                <?php endif; ?>
                <h1 class="text-3xl md:text-4xl font-bold text-navy dark-text-heading mt-2 mb-4"><?= e(Language::field($service, 'name')) ?></h1>
                <p class="text-gray-600 dark-text-muted text-lg leading-relaxed mb-6"><?= e(Language::field($service, 'description')) ?></p>
                <div class="flex flex-wrap gap-4 mb-6">
                    <div class="glass-card rounded-xl px-5 py-3">
                        <p class="text-xs text-gray-500"><?= e(Language::t('price')) ?></p>
                        <p class="text-xl font-bold text-dental"><?= format_price($service['price']) ?></p>
                    </div>
                    <div class="glass-card rounded-xl px-5 py-3">
                        <p class="text-xs text-gray-500"><?= e(Language::t('duration')) ?></p>
                        <p class="text-xl font-bold text-navy dark-text-heading"><?= $service['duration'] ?> <?= e(Language::t('minutes')) ?></p>
                    </div>
                </div>
                <?php if (Language::field($service, 'benefits')): ?>
                <div class="mb-6">
                    <h3 class="font-bold text-navy dark-text-heading mb-2"><?= e(Language::t('benefits')) ?></h3>
                    <p class="text-gray-600 dark-text-muted"><?= e(Language::field($service, 'benefits')) ?></p>
                </div>
                <?php endif; ?>
                <?php
                $procedure = Language::field($service, 'procedure_details');
                if ($procedure): ?>
                <div class="mb-8">
                    <h3 class="font-bold text-navy dark-text-heading mb-2"><?= e(Language::t('procedure')) ?></h3>
                    <p class="text-gray-600 dark-text-muted"><?= nl2br(e($procedure)) ?></p>
                </div>
                <?php endif; ?>
                <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Service inquiry') ?>" class="btn-primary text-lg px-8 py-4"><?= e(Language::t('contact_us')) ?></a>
            </div>
        </div>

        <?php if (!empty($faqs)): ?>
        <div class="mb-16 reveal-up">
            <h2 class="text-2xl font-bold text-navy dark-text-heading section-title mb-8"><?= e(Language::t('faq')) ?></h2>
            <div class="grid md:grid-cols-2 gap-4">
                <?php foreach ($faqs as $i => $faq): ?>
                <div class="glass-card rounded-xl p-5">
                    <p class="font-semibold text-navy dark-text-heading mb-2"><?= e(Language::field($faq, 'question')) ?></p>
                    <p class="text-sm text-gray-500 dark-text-muted"><?= e(Language::field($faq, 'answer')) ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <?php if (!empty($related)): ?>
        <div class="reveal-up">
            <h2 class="text-2xl font-bold text-navy dark-text-heading mb-8"><?= e(Language::t('our_services')) ?></h2>
            <div class="grid md:grid-cols-3 gap-6">
                <?php foreach ($related as $s): ?>
                <a href="service-detail.php?slug=<?= e($s['slug']) ?>" class="glass-card rounded-xl p-5 hover:shadow-lg transition block">
                    <h3 class="font-bold text-navy dark-text-heading"><?= e(Language::field($s, 'name')) ?></h3>
                    <p class="text-dental text-sm mt-1"><?= format_price($s['price']) ?></p>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
