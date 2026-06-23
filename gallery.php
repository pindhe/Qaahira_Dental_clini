<?php
$pageTitleKey = 'gallery';
require_once __DIR__ . '/includes/public-header.php';

$category = $_GET['category'] ?? 'all';
$where = '1=1';
$params = [];
if ($category !== 'all') {
    $where = 'category = ?';
    $params = [$category];
}
$images = Database::fetchAll("SELECT * FROM gallery WHERE {$where} ORDER BY sort_order, id DESC", $params);

$categories = [
    'all'       => Language::t('all'),
    'clinic'    => Language::t('gallery_clinic'),
    'equipment' => Language::t('gallery_equipment'),
    'treatment' => Language::t('gallery_treatments'),
    'results'   => Language::t('gallery_results'),
    'team'      => Language::get() === 'ar' ? 'الفريق' : 'Team',
];

$heroBg = !empty($images[0]['image']) ? upload_url($images[0]['image']) : 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'استعرض عيادتنا ونتائج العلاج' : 'Explore our clinic, treatments, and results';
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-3 mb-12 reveal-up">
            <?php foreach ($categories as $key => $label): ?>
            <a href="?category=<?= $key ?>" class="filter-pill <?= $category === $key ? 'active' : '' ?>"><?= e($label) ?></a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($images)): ?>
        <div class="empty-state glass-card rounded-2xl reveal-up">
            <p class="text-4xl mb-3">📷</p>
            <p><?= Language::get() === 'ar' ? 'لا توجد صور بعد — أضف صوراً من لوحة التحكم' : 'No images yet — add photos from the admin panel' ?></p>
        </div>
        <?php else: ?>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <?php foreach ($images as $i => $img): ?>
            <div class="gallery-item aspect-square rounded-xl overflow-hidden reveal-up tilt-hover" style="--delay:<?= ($i % 8) * 0.05 ?>s" data-title="<?= e(Language::field($img, 'title')) ?>">
                <img src="<?= e(upload_url($img['image'])) ?>" alt="<?= e(Language::field($img, 'title')) ?>" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                    <span class="text-white text-sm font-medium"><?= e(Language::field($img, 'title') ?: ucfirst($img['category'])) ?></span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
