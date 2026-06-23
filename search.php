<?php
$pageTitleKey = 'search';
require_once __DIR__ . '/includes/public-header.php';

$q = trim($_GET['q'] ?? '');
$services = $blogs = $dentists = [];

if ($q) {
    $like = '%' . $q . '%';
    $services = Database::fetchAll(
        'SELECT * FROM services WHERE is_active = 1 AND (name LIKE ? OR name_ar LIKE ? OR description LIKE ?)',
        [$like, $like, $like]
    );
    $blogs = Database::fetchAll(
        'SELECT * FROM blogs WHERE is_published = 1 AND (title LIKE ? OR title_ar LIKE ? OR excerpt LIKE ?)',
        [$like, $like, $like]
    );
    $dentists = Database::fetchAll(
        'SELECT * FROM dentists WHERE is_active = 1 AND (name LIKE ? OR name_ar LIKE ? OR specialization LIKE ?)',
        [$like, $like, $like]
    );
}

$heroSubtitle = $q ? (Language::get() === 'ar' ? "نتائج البحث عن: {$q}" : "Results for: {$q}") : Language::t('search_placeholder');
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-4xl mx-auto px-4">
        <form method="GET" class="mb-12 reveal-up">
            <div class="flex gap-3">
                <input type="text" name="q" value="<?= e($q) ?>" placeholder="<?= e(Language::t('search_placeholder')) ?>" class="form-input text-lg flex-1" autofocus>
                <button type="submit" class="btn-primary px-8"><?= e(Language::t('search')) ?></button>
            </div>
        </form>

        <?php if ($q && empty($services) && empty($blogs) && empty($dentists)): ?>
        <div class="empty-state glass-card rounded-2xl reveal-up"><?= e(Language::t('no_results')) ?></div>
        <?php endif; ?>

        <?php if (!empty($services)): ?>
        <div class="mb-10 reveal-up">
            <h2 class="text-xl font-bold text-navy dark-text-heading mb-4"><?= e(Language::t('services')) ?></h2>
            <div class="space-y-3">
                <?php foreach ($services as $s): ?>
                <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Service inquiry') ?>" class="block glass-card rounded-xl p-4 hover:shadow-md transition tilt-hover">
                    <span class="font-medium text-navy dark-text-heading"><?= e(Language::field($s, 'name')) ?></span>
                    <span class="text-dental text-sm ml-2"><?= format_price($s['price']) ?></span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <?php if (!empty($dentists)): ?>
        <div class="mb-10 reveal-up">
            <h2 class="text-xl font-bold text-navy dark-text-heading mb-4"><?= e(Language::t('dentists')) ?></h2>
            <div class="space-y-3">
                <?php foreach ($dentists as $d): ?>
                <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Dentist inquiry') ?>" class="block glass-card rounded-xl p-4 hover:shadow-md transition">
                    <span class="font-medium text-navy dark-text-heading"><?= e(Language::field($d, 'name')) ?></span>
                    <span class="text-gray-400 text-sm ml-2"><?= e(Language::field($d, 'specialization')) ?></span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <?php if (!empty($blogs)): ?>
        <div class="reveal-up">
            <h2 class="text-xl font-bold text-navy dark-text-heading mb-4"><?= e(Language::t('blog')) ?></h2>
            <div class="space-y-3">
                <?php foreach ($blogs as $b): ?>
                <a href="<?= APP_URL ?>/blog-detail.php?slug=<?= e($b['slug']) ?>" class="block glass-card rounded-xl p-4 hover:shadow-md transition">
                    <span class="font-medium text-navy dark-text-heading"><?= e(Language::field($b, 'title')) ?></span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
