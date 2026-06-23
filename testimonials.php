<?php
$pageTitleKey = 'testimonials';
require_once __DIR__ . '/includes/public-header.php';

$testimonials = Database::fetchAll('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC');
$avgRating = round((float)(Database::fetch('SELECT AVG(rating) as a FROM testimonials WHERE is_active = 1')['a'] ?? 5), 1);
$totalReviews = count($testimonials);

$heroBg = 'https://images.unsplash.com/photo-1606811971610-4486d0f44770?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? "متوسط التقييم {$avgRating} من {$totalReviews} مراجعة" : "Average rating {$avgRating} from {$totalReviews} reviews";
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<!-- Rating summary -->
<section class="stats-bar relative z-20 -mt-12 mx-4 sm:mx-6 max-w-lg lg:mx-auto">
    <div class="glass-card rounded-2xl p-6 text-center shadow-xl reveal-up">
        <div class="flex justify-center gap-1 mb-2">
            <?php for ($r = 1; $r <= 5; $r++): ?>
            <span class="text-2xl <?= $r <= round($avgRating) ? 'text-yellow-400' : 'text-gray-300' ?>">★</span>
            <?php endfor; ?>
        </div>
        <p class="text-3xl font-bold text-navy dark-text-heading"><?= $avgRating ?> / 5</p>
        <p class="text-sm text-gray-500 dark-text-muted"><?= $totalReviews ?> <?= e(Language::t('reviews_count')) ?></p>
    </div>
</section>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php if (empty($testimonials)): ?>
        <div class="empty-state glass-card rounded-2xl"><?= Language::get() === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet' ?></div>
        <?php else: ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($testimonials as $i => $t): ?>
            <div class="testimonial-card reveal-up tilt-hover" style="--delay:<?= $i * 0.07 ?>s">
                <div class="glass-card rounded-2xl p-8 h-full relative">
                    <div class="text-5xl text-dental/15 absolute top-3 right-5 font-serif leading-none">"</div>
                    <div class="flex gap-0.5 mb-4">
                        <?php for ($r = 0; $r < $t['rating']; $r++): ?><span class="text-yellow-400 text-lg">★</span><?php endfor; ?>
                    </div>
                    <p class="text-gray-600 dark-text-muted mb-6 leading-relaxed relative z-10"><?= e(Language::field($t, 'review')) ?></p>
                    <div class="flex items-center gap-3 border-t dark-border pt-4">
                        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-dental to-navy flex items-center justify-center font-bold text-white text-sm">
                            <?= e(substr($t['patient_name'], 0, 1)) ?>
                        </div>
                        <div>
                            <p class="font-semibold text-navy dark-text-heading text-sm"><?= e(Language::field($t, 'patient_name')) ?></p>
                            <p class="text-xs text-gray-400"><?= format_date($t['created_at']) ?></p>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<section class="cta-section relative py-20 overflow-hidden mx-4 mb-8 rounded-2xl">
    <div class="cta-overlay absolute inset-0 rounded-2xl" style="background:linear-gradient(135deg,#8B1E2D,#E67E22)"></div>
    <div class="relative z-10 text-center text-white px-4 reveal-up">
        <h2 class="text-2xl font-bold mb-3"><?= Language::get() === 'ar' ? 'شاركنا تجربتك' : 'Share Your Experience' ?></h2>
        <a href="<?= APP_URL ?>/contact.php" class="btn-glass inline-block mt-4"><?= e(Language::t('contact_us')) ?></a>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
