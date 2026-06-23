<?php
$pageTitleKey = 'dentists';
require_once __DIR__ . '/includes/public-header.php';

$dentists = Database::fetchAll('SELECT * FROM dentists WHERE is_active = 1 ORDER BY sort_order');
$heroBg = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'فريق من المتخصصين المعتمدين ذوي الخبرة' : 'A team of certified, experienced specialists';
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php if (empty($dentists)): ?>
        <div class="empty-state glass-card rounded-2xl"><?= Language::get() === 'ar' ? 'لا يوجد أطباء حالياً' : 'No dentists available' ?></div>
        <?php else: ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php foreach ($dentists as $i => $d): ?>
            <div class="dentist-card-3d reveal-up tilt-hover" style="--delay:<?= $i * 0.1 ?>s">
                <div class="glass-card rounded-2xl overflow-hidden group">
                    <div class="dentist-img-wrap h-72 relative overflow-hidden">
                        <?php if ($d['photo']): ?>
                        <img src="<?= e(upload_url($d['photo'])) ?>" alt="" class="w-full h-full object-cover dentist-img">
                        <?php else: ?>
                        <div class="w-full h-full bg-gradient-to-br from-dental-light to-navy/20 flex items-center justify-center">
                            <span class="text-7xl font-bold text-dental/30"><?= e(substr($d['name'], 0, 1)) ?></span>
                        </div>
                        <?php endif; ?>
                        <div class="dentist-overlay">
                            <a href="<?= APP_URL ?>/contact.php?subject=<?= urlencode('Dentist inquiry') ?>" class="btn-glow text-sm py-2 px-5"><?= e(Language::t('contact_us')) ?></a>
                        </div>
                    </div>
                    <div class="p-8">
                        <h3 class="font-bold text-navy dark-text-heading text-xl"><?= e(Language::field($d, 'name')) ?></h3>
                        <p class="text-dental font-medium mt-1 mb-4"><?= e(Language::field($d, 'specialization')) ?></p>
                        <div class="space-y-2 text-sm text-gray-600 dark-text-muted">
                            <p class="flex gap-2"><span class="text-dental">●</span> <strong><?= e(Language::t('qualification')) ?>:</strong> <?= e($d['qualification']) ?></p>
                            <p class="flex gap-2"><span class="text-dental">●</span> <strong><?= e(Language::t('experience')) ?>:</strong> <?= e($d['experience']) ?></p>
                            <?php if ($d['education']): ?>
                            <p class="flex gap-2"><span class="text-dental">●</span> <strong><?= e(Language::t('education')) ?>:</strong> <?= e(Language::get() === 'ar' && !empty($d['education_ar']) ? $d['education_ar'] : $d['education']) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($d['awards']) || !empty($d['awards_ar'])): ?>
                            <p class="flex gap-2"><span class="text-dental">●</span> <strong><?= e(Language::t('awards')) ?>:</strong> <?= e(Language::get() === 'ar' && !empty($d['awards_ar']) ? $d['awards_ar'] : ($d['awards'] ?? '')) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($d['languages_spoken'])): ?>
                            <p class="flex gap-2"><span class="text-dental">●</span> <strong><?= e(Language::t('languages')) ?>:</strong> <?= e($d['languages_spoken']) ?></p>
                            <?php endif; ?>
                        </div>
                        <?php if (Language::field($d, 'bio')): ?>
                        <p class="mt-4 text-sm text-gray-500 dark-text-muted border-t dark-border pt-4"><?= e(Language::field($d, 'bio')) ?></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
