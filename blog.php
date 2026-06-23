<?php
$pageTitleKey = 'blog';
require_once __DIR__ . '/includes/public-header.php';

$category = $_GET['category'] ?? 'all';
$sql = 'SELECT * FROM blogs WHERE is_published = 1';
$params = [];
if ($category !== 'all') {
    $sql .= ' AND category = ?';
    $params[] = $category;
}
$sql .= ' ORDER BY published_at DESC';
$blogs = Database::fetchAll($sql, $params);

$blogCategories = [
    'all' => Language::t('all'),
    'dental-tips' => Language::t('blog_category_tips'),
    'oral-health' => Language::t('blog_category_health'),
    'cosmetic' => Language::t('blog_category_cosmetic'),
    'children' => Language::t('blog_category_children'),
    'news' => Language::t('blog_category_news'),
];

$heroBg = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'نصائح وأخبار طب الأسنان' : 'Dental health tips, news, and insights';
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-3 mb-12 reveal-up">
            <?php foreach ($blogCategories as $key => $label): ?>
            <a href="?category=<?= $key ?>" class="filter-pill <?= $category === $key ? 'active' : '' ?>"><?= e($label) ?></a>
            <?php endforeach; ?>
        </div>
        <?php if (empty($blogs)): ?>
        <div class="empty-state glass-card rounded-2xl reveal-up"><?= Language::get() === 'ar' ? 'لا توجد مقالات بعد' : 'No blog posts yet' ?></div>
        <?php else: ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($blogs as $i => $blog): ?>
            <a href="<?= APP_URL ?>/blog-detail.php?slug=<?= e($blog['slug']) ?>" class="blog-card-3d reveal-up tilt-hover block" style="--delay:<?= $i * 0.08 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden h-full group">
                    <div class="h-52 overflow-hidden relative">
                        <?php if ($blog['featured_image']): ?>
                        <img src="<?= e(upload_url($blog['featured_image'])) ?>" alt="" class="w-full h-full object-cover blog-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-br from-dental-light to-dental/20 flex items-center justify-center">
                            <svg class="w-14 h-14 text-dental/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </div>
                        <?php endif; ?>
                        <div class="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-800/90 text-xs font-medium rounded-full text-dental">
                            <?= $blog['published_at'] ? format_date($blog['published_at']) : '' ?>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-xs text-gray-400 mb-2"><?= e($blog['author']) ?></p>
                        <h3 class="font-bold text-navy dark-text-heading text-lg mb-2 group-hover:text-dental transition-colors"><?= e(Language::field($blog, 'title')) ?></h3>
                        <p class="text-sm text-gray-500 dark-text-muted line-clamp-2"><?= e(Language::field($blog, 'excerpt')) ?></p>
                        <span class="text-dental text-sm font-semibold mt-4 inline-block"><?= e(Language::t('read_more')) ?> →</span>
                    </div>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
