<?php
require_once __DIR__ . '/includes/bootstrap-public.php';

$slug = $_GET['slug'] ?? '';
$blog = Database::fetch('SELECT * FROM blogs WHERE slug = ? AND is_published = 1', [$slug]);

if (!$blog) {
    header('HTTP/1.0 404 Not Found');
    redirect(APP_URL . '/blog.php');
}

Database::query('UPDATE blogs SET views = views + 1 WHERE id = ?', [$blog['id']]);

$pageTitle = Language::field($blog, 'title');
$metaDescription = mb_substr(strip_tags(Language::field($blog, 'excerpt') ?: Language::field($blog, 'content')), 0, 160);
$heroTitle = $pageTitle;
$heroSubtitle = ($blog['author'] ? e($blog['author']) . ' • ' : '') . ($blog['published_at'] ? format_date($blog['published_at']) : '');
$heroBg = $blog['featured_image'] ? upload_url($blog['featured_image']) : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80';

require_once __DIR__ . '/includes/public-header.php';
require __DIR__ . '/includes/page-hero.php';
?>

<article class="section-pad">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="text-sm text-gray-500 dark-text-muted mb-8 reveal-up">
            <a href="<?= APP_URL ?>" class="hover:text-dental"><?= e(Language::t('home')) ?></a>
            <span class="mx-2">/</span>
            <a href="<?= APP_URL ?>/blog.php" class="hover:text-dental"><?= e(Language::t('blog')) ?></a>
            <span class="mx-2">/</span>
            <span class="text-navy dark-text-heading"><?= e(Language::field($blog, 'title')) ?></span>
        </nav>

        <?php if ($blog['featured_image']): ?>
        <div class="reveal-up mb-10 rounded-2xl overflow-hidden shadow-xl img-3d-frame">
            <img src="<?= e(upload_url($blog['featured_image'])) ?>" alt="" class="w-full max-h-[420px] object-cover">
        </div>
        <?php endif; ?>

        <div class="glass-card rounded-2xl p-8 md:p-12 reveal-up">
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark-text-muted mb-8 pb-6 border-b dark-border">
                <span class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full bg-dental/10 flex items-center justify-center text-dental font-bold text-xs"><?= e(substr($blog['author'] ?? 'A', 0, 1)) ?></span>
                    <?= e($blog['author']) ?>
                </span>
                <?php if ($blog['published_at']): ?>
                <span>• <?= format_date($blog['published_at']) ?></span>
                <?php endif; ?>
                <span>• <?= (int)$blog['views'] ?> <?= Language::get() === 'ar' ? 'مشاهدة' : 'views' ?></span>
            </div>
            <div class="prose prose-lg max-w-none text-gray-700 dark:text-slate-300 leading-relaxed blog-content">
                <?= Language::get() === 'ar' && $blog['content_ar'] ? $blog['content_ar'] : $blog['content'] ?>
            </div>
        </div>

        <div class="mt-10 flex flex-wrap gap-4 reveal-up">
            <a href="<?= APP_URL ?>/blog.php" class="btn-outline">← <?= e(Language::t('blog')) ?></a>
            <a href="<?= APP_URL ?>/contact.php" class="btn-primary"><?= e(Language::t('contact_us')) ?></a>
        </div>
    </div>
</article>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
