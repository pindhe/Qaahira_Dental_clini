<?php
$pageTitleKey = 'services';
require_once __DIR__ . '/includes/public-header.php';

$categoryFilter = $_GET['category'] ?? 'all';
$categories = Database::fetchAll('SELECT * FROM service_categories ORDER BY name');

$sql = 'SELECT s.*, c.name as category_name, c.name_ar as category_name_ar, c.slug as category_slug
        FROM services s LEFT JOIN service_categories c ON s.category_id = c.id WHERE s.is_active = 1';
$params = [];
if ($categoryFilter !== 'all') {
    $sql .= ' AND c.slug = ?';
    $params[] = $categoryFilter;
}
$sql .= ' ORDER BY s.sort_order, s.name';
$services = Database::fetchAll($sql, $params);

$heroBg = 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'خدمات أسنان شاملة لابتسامة صحية ومشرقة' : 'Comprehensive dental services for a healthy, confident smile';
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category filters -->
        <div class="flex flex-wrap justify-center gap-3 mb-12 reveal-up">
            <a href="?category=all" class="filter-pill <?= $categoryFilter === 'all' ? 'active' : '' ?>"><?= Language::get() === 'ar' ? 'الكل' : 'All' ?></a>
            <?php foreach ($categories as $cat): ?>
            <a href="?category=<?= e($cat['slug']) ?>" class="filter-pill <?= $categoryFilter === $cat['slug'] ? 'active' : '' ?>">
                <?= e(Language::get() === 'ar' ? $cat['name_ar'] : $cat['name']) ?>
            </a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($services)): ?>
        <div class="empty-state glass-card rounded-2xl reveal-up">
            <p class="text-lg"><?= e(Language::t('no_results')) ?></p>
        </div>
        <?php else: ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($services as $i => $service): ?>
            <div class="service-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.06 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                    <div class="service-img-wrap h-52 relative overflow-hidden">
                        <?php if ($service['image']): ?>
                        <img src="<?= e(upload_url($service['image'])) ?>" alt="" class="w-full h-full object-cover service-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-br from-dental-light to-dental/20 flex items-center justify-center">
                            <svg class="w-16 h-16 text-dental/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 3 1.5 4C7 12 5 14 5 17c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5 0-3-2-5-4-6.5 1-1 1.5-2.5 1.5-4C16.5 4 14.5 2 12 2z"/></svg>
                        </div>
                        <?php endif; ?>
                        <?php if ($service['category_name']): ?>
                        <span class="absolute top-3 left-3 px-3 py-1 bg-dental/90 text-white text-xs rounded-full backdrop-blur-sm">
                            <?= e(Language::get() === 'ar' ? $service['category_name_ar'] : $service['category_name']) ?>
                        </span>
                        <?php endif; ?>
                        <div class="service-price-tag"><?= format_price($service['price']) ?></div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <h3 class="font-bold text-navy dark-text-heading text-lg mb-2">
                            <a href="<?= APP_URL ?>/service-detail.php?slug=<?= e($service['slug']) ?>" class="hover:text-dental transition"><?= e(Language::field($service, 'name')) ?></a>
                        </h3>
                        <p class="text-sm text-gray-500 dark-text-muted mb-3 flex-1"><?= e(Language::field($service, 'description')) ?></p>
                        <?php if ($service['before_image'] && $service['after_image']): ?>
                        <div class="grid grid-cols-2 gap-2 mb-3">
                            <img src="<?= e(upload_url($service['before_image'])) ?>" alt="" class="rounded-lg h-16 object-cover">
                            <img src="<?= e(upload_url($service['after_image'])) ?>" alt="" class="rounded-lg h-16 object-cover">
                        </div>
                        <?php endif; ?>
                        <?php if (Language::field($service, 'benefits')): ?>
                        <p class="text-xs text-dental/80 mb-4"><strong><?= e(Language::t('benefits')) ?>:</strong> <?= e(Language::field($service, 'benefits')) ?></p>
                        <?php endif; ?>
                        <div class="flex justify-between items-center pt-4 border-t dark-border">
                            <span class="text-xs text-gray-400"><?= $service['duration'] ?> <?= e(Language::t('minutes')) ?></span>
                            <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Service inquiry') ?>" class="btn-primary text-sm py-2 px-4"><?= e(Language::t('contact_us')) ?></a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
