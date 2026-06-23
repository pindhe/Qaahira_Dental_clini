<?php
$pageTitleKey = 'faq';
require_once __DIR__ . '/includes/public-header.php';

$faqs = Database::fetchAll('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order');
$heroBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80';
$heroSubtitle = Language::get() === 'ar' ? 'إجابات على الأسئلة الأكثر شيوعاً' : 'Answers to the most common questions';
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-3xl mx-auto px-4">
        <?php if (empty($faqs)): ?>
        <div class="empty-state glass-card rounded-2xl reveal-up"><?= Language::get() === 'ar' ? 'لا توجد أسئلة بعد' : 'No FAQs yet' ?></div>
        <?php else: ?>
        <div class="space-y-4">
            <?php foreach ($faqs as $i => $faq): ?>
            <div class="faq-item glass-card rounded-2xl overflow-hidden reveal-up <?= $i === 0 ? 'open' : '' ?>" style="--delay:<?= $i * 0.05 ?>s">
                <button type="button" class="faq-toggle w-full px-6 py-5 text-left flex justify-between items-center gap-4 font-semibold text-navy dark-text-heading hover:bg-dental/5 transition">
                    <span><?= e(Language::field($faq, 'question')) ?></span>
                    <svg class="w-5 h-5 flex-shrink-0 text-dental faq-icon transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-content text-gray-600 dark-text-muted leading-relaxed">
                    <?= nl2br(e(Language::field($faq, 'answer'))) ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div class="mt-12 glass-card rounded-2xl p-8 text-center reveal-up">
            <h3 class="font-bold text-navy dark-text-heading text-lg mb-2"><?= Language::get() === 'ar' ? 'لم تجد إجابتك؟' : "Didn't find your answer?" ?></h3>
            <p class="text-gray-500 dark-text-muted text-sm mb-4"><?= Language::get() === 'ar' ? 'تواصل معنا وسنسعد بمساعدتك' : 'Contact us and we will be happy to help' ?></p>
            <a href="<?= APP_URL ?>/contact.php" class="btn-primary"><?= e(Language::t('contact_us')) ?></a>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
