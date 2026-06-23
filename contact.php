<?php
$pageTitleKey = 'contact';
require_once __DIR__ . '/includes/public-header.php';

$success = flash('success');
$error = flash('error');
$prefillSubject = trim($_GET['subject'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        flash('error', 'Invalid request.');
        redirect(APP_URL . '/contact.php');
    }

    $data = [
        'name'    => trim($_POST['name'] ?? ''),
        'email'   => trim($_POST['email'] ?? ''),
        'phone'   => trim($_POST['phone'] ?? ''),
        'subject' => trim($_POST['subject'] ?? ''),
        'message' => trim($_POST['message'] ?? ''),
    ];

    if (!$data['name'] || !$data['email'] || !$data['subject'] || !$data['message']) {
        flash('error', Language::get() === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields.');
        redirect(APP_URL . '/contact.php');
    }

    Database::insert('contact_messages', $data);
    create_notification('contact', 'New Message', $data['name'] . ': ' . $data['subject'], '/admin/messages.php');
    send_email_notification(setting('email'), 'Contact: ' . $data['subject'], '<p>From: ' . e($data['name']) . ' (' . e($data['email']) . ')</p><p>' . nl2br(e($data['message'])) . '</p>');

    flash('success', Language::t('contact_success'));
    redirect(APP_URL . '/contact.php');
}

$heroBg = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80';
$heroSubtitle = Language::t('get_in_touch');
$hours = json_decode(setting('working_hours', '{}'), true) ?: [];
?>

<?php require __DIR__ . '/includes/page-hero.php'; ?>

<section class="section-pad">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-5 gap-10">
            <!-- Contact info -->
            <div class="lg:col-span-2 space-y-6 reveal-left">
                <div class="glass-card rounded-2xl p-8">
                    <h3 class="font-bold text-navy dark-text-heading text-xl mb-6"><?= e(Language::t('contact')) ?></h3>
                    <div class="space-y-2">
                        <div class="contact-info-card">
                            <div class="contact-icon"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                            <div><p class="text-xs text-gray-400"><?= e(Language::t('phone')) ?></p><a href="tel:<?= e(preg_replace('/[^0-9+]/', '', setting('phone'))) ?>" class="font-medium text-navy dark-text-heading hover:text-dental"><?= e(setting('phone')) ?></a></div>
                        </div>
                        <div class="contact-info-card">
                            <div class="contact-icon"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                            <div><p class="text-xs text-gray-400"><?= e(Language::t('email')) ?></p><a href="mailto:<?= e(setting('email')) ?>" class="font-medium text-navy dark-text-heading hover:text-dental"><?= e(setting('email')) ?></a></div>
                        </div>
                        <div class="contact-info-card">
                            <div class="contact-icon"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                            <div><p class="text-xs text-gray-400"><?= Language::get() === 'ar' ? 'العنوان' : 'Address' ?></p><p class="font-medium text-navy dark-text-heading text-sm"><?= e(Language::get() === 'ar' ? setting('address_ar') : setting('address')) ?></p><a href="<?= e(google_maps_place_url()) ?>" target="_blank" rel="noopener noreferrer" class="text-dental text-xs hover:underline mt-1 inline-block"><?= Language::get() === 'ar' ? 'عرض على الخريطة' : 'View on map' ?></a></div>
                        </div>
                        <?php if ($wa = whatsapp_number()): ?>
                        <a href="<?= e(whatsapp_url()) ?>" target="_blank" rel="noopener noreferrer" class="contact-info-card mt-2 !bg-green-50 dark:!bg-green-900/20 rounded-xl">
                            <div class="contact-icon !bg-green-100 !text-green-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
                            <div><p class="text-xs text-gray-400">WhatsApp</p><p class="font-medium text-green-600"><?= e($wa) ?></p></div>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="glass-card rounded-2xl p-8">
                    <h3 class="font-bold text-navy dark-text-heading mb-4"><?= e(Language::t('working_hours')) ?></h3>
                    <div class="space-y-2">
                        <?php foreach (['mon','tue','wed','thu','fri','sat','sun'] as $day): ?>
                        <div class="flex justify-between text-sm py-1.5 border-b dark-border last:border-0">
                            <span class="text-gray-500 dark-text-muted"><?= e(Language::t($day)) ?></span>
                            <span class="font-medium text-navy dark-text-heading"><?= e($hours[$day] ?? Language::t('closed')) ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div class="lg:col-span-3 reveal-right">
                <?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>
                <?php if ($error): ?><div class="alert-error mb-6"><?= e($error) ?></div><?php endif; ?>

                <form method="POST" data-validate class="glass-card rounded-2xl p-8 space-y-5">
                    <?= csrf_field() ?>
                    <h3 class="font-bold text-navy dark-text-heading text-xl mb-2"><?= e(Language::t('send_message')) ?></h3>
                    <p class="text-sm text-gray-500 dark-text-muted mb-4"><?= e(Language::t('contact_for_appointment')) ?></p>
                    <div>
                        <label class="block text-sm font-medium mb-2 dark-text-muted"><?= e(Language::t('full_name')) ?> *</label>
                        <input type="text" name="name" required class="form-input">
                    </div>
                    <div class="grid md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium mb-2 dark-text-muted"><?= e(Language::t('email')) ?> *</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2 dark-text-muted"><?= e(Language::t('phone')) ?></label>
                            <input type="tel" name="phone" class="form-input">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2 dark-text-muted"><?= e(Language::t('subject')) ?> *</label>
                        <input type="text" name="subject" required class="form-input" value="<?= e($prefillSubject) ?>">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2 dark-text-muted"><?= e(Language::t('message')) ?> *</label>
                        <textarea name="message" rows="5" required class="form-input"></textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full py-4 text-lg"><?= e(Language::t('send_message')) ?></button>
                </form>
            </div>
        </div>

        <?php if ($map = google_maps_embed_url()): ?>
        <div class="mt-14 reveal-up">
            <div class="rounded-2xl overflow-hidden shadow-xl h-96">
                <iframe src="<?= e($map) ?>" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="<?= e(Language::get() === 'ar' ? 'موقع العيادة على الخريطة' : 'Clinic location on map') ?>"></iframe>
            </div>
            <p class="text-center mt-4">
                <a href="<?= e(google_maps_place_url()) ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-dental font-medium hover:underline">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <?= Language::get() === 'ar' ? 'افتح في خرائط Google' : 'Open in Google Maps' ?>
                </a>
            </p>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php require_once __DIR__ . '/includes/public-footer.php'; ?>
