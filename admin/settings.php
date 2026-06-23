<?php
$adminPage = 'settings';
$pageTitle = 'Website Settings';
require_once __DIR__ . '/includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $textFields = [
        'site_name','site_name_ar','tagline','tagline_ar','phone','email','whatsapp',
        'address','address_ar','map_embed','map_place_url','facebook','instagram','twitter','youtube',
        'meta_description','meta_description_ar','meta_keywords','google_analytics',
        'years_experience','satisfaction_rate',
    ];
    foreach ($textFields as $key) {
        if (isset($_POST[$key])) {
            upsert_setting($key, trim($_POST[$key]));
        }
    }
    upsert_setting('smtp_enabled', isset($_POST['smtp_enabled']) ? '1' : '0', 'email');
    upsert_setting('sms_enabled', isset($_POST['sms_enabled']) ? '1' : '0', 'sms');

    $hours = [];
    foreach (['mon','tue','wed','thu','fri','sat','sun'] as $day) {
        $hours[$day] = trim($_POST['hours'][$day] ?? 'Closed');
    }
    upsert_setting('working_hours', json_encode($hours), 'hours');

    foreach (['site_logo' => 'branding', 'favicon' => 'branding', 'hero_image' => 'homepage'] as $field => $subdir) {
        if (!empty($_FILES[$field]['name'])) {
            $uploaded = upload_file($_FILES[$field], $subdir);
            if ($uploaded) upsert_setting($field, $uploaded, $subdir === 'branding' ? 'general' : 'homepage');
        }
    }

    flash('success', 'Settings saved.');
    redirect(APP_URL . '/admin/settings.php');
}

$settings = [];
foreach (Database::fetchAll('SELECT setting_key, setting_value FROM settings') as $row) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
$hours = json_decode($settings['working_hours'] ?? '{}', true) ?: [];
$success = flash('success');
?>

<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<form method="POST" enctype="multipart/form-data" class="space-y-8">
    <?= csrf_field() ?>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">General & Branding</h3>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <input type="text" name="site_name" placeholder="Site Name (EN)" class="form-input" value="<?= e($settings['site_name'] ?? '') ?>">
            <input type="text" name="site_name_ar" placeholder="Site Name (AR)" class="form-input" value="<?= e($settings['site_name_ar'] ?? '') ?>">
            <input type="text" name="tagline" placeholder="Tagline (EN)" class="form-input" value="<?= e($settings['tagline'] ?? '') ?>">
            <input type="text" name="tagline_ar" placeholder="Tagline (AR)" class="form-input" value="<?= e($settings['tagline_ar'] ?? '') ?>">
            <input type="number" name="years_experience" placeholder="Years Experience" class="form-input" value="<?= e($settings['years_experience'] ?? '15') ?>">
            <input type="number" name="satisfaction_rate" placeholder="Satisfaction %" class="form-input" value="<?= e($settings['satisfaction_rate'] ?? '98') ?>" min="0" max="100">
        </div>
        <div class="grid md:grid-cols-3 gap-4">
            <div>
                <label class="text-sm text-gray-500 block mb-1">Site Logo</label>
                <p class="text-xs text-gray-500 mb-2">Current logo<?= empty($settings['site_logo']) ? ' (default)' : '' ?></p>
                <img src="<?= e(brand_logo_url()) ?>" class="h-12 mb-2 object-contain" alt="">
                <input type="file" name="site_logo" accept="image/*" class="form-input text-sm">
            </div>
            <div>
                <label class="text-sm text-gray-500 block mb-1">Favicon</label>
                <p class="text-xs text-gray-500 mb-2">Current favicon<?= empty($settings['favicon']) ? ' (default)' : '' ?></p>
                <img src="<?= e(favicon_url()) ?>" class="h-8 mb-2 object-contain" alt="">
                <input type="file" name="favicon" accept="image/*" class="form-input text-sm">
            </div>
            <div>
                <label class="text-sm text-gray-500 block mb-1">Hero Background</label>
                <?php if (!empty($settings['hero_image'])): ?><img src="<?= e(upload_url($settings['hero_image'])) ?>" class="h-16 mb-2 rounded object-cover" alt=""><?php endif; ?>
                <input type="file" name="hero_image" accept="image/*" class="form-input text-sm">
            </div>
        </div>
    </div>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">SEO</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <textarea name="meta_description" placeholder="Meta Description (EN)" class="form-input" rows="2"><?= e($settings['meta_description'] ?? '') ?></textarea>
            <textarea name="meta_description_ar" placeholder="Meta Description (AR)" class="form-input" rows="2"><?= e($settings['meta_description_ar'] ?? '') ?></textarea>
            <input type="text" name="meta_keywords" placeholder="Meta Keywords" class="form-input md:col-span-2" value="<?= e($settings['meta_keywords'] ?? '') ?>">
            <input type="text" name="google_analytics" placeholder="Google Analytics ID (G-XXXXXXXX)" class="form-input md:col-span-2" value="<?= e($settings['google_analytics'] ?? '') ?>">
        </div>
    </div>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">Contact Information</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <input type="text" name="phone" placeholder="Phone" class="form-input" value="<?= e($settings['phone'] ?? '') ?>">
            <input type="email" name="email" placeholder="Email" class="form-input" value="<?= e($settings['email'] ?? '') ?>">
            <input type="text" name="whatsapp" placeholder="WhatsApp" class="form-input" value="<?= e($settings['whatsapp'] ?? '') ?>">
            <input type="text" name="address" placeholder="Address (EN)" class="form-input" value="<?= e($settings['address'] ?? '') ?>">
            <input type="text" name="address_ar" placeholder="Address (AR)" class="form-input" value="<?= e($settings['address_ar'] ?? '') ?>">
            <input type="text" name="map_embed" placeholder="Google Maps Embed URL" class="form-input md:col-span-2" value="<?= e($settings['map_embed'] ?? '') ?>">
            <input type="url" name="map_place_url" placeholder="Google Maps Place Link" class="form-input md:col-span-2" value="<?= e($settings['map_place_url'] ?? '') ?>">
        </div>
    </div>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">Social Media</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <input type="url" name="facebook" placeholder="Facebook URL" class="form-input" value="<?= e($settings['facebook'] ?? '') ?>">
            <input type="url" name="instagram" placeholder="Instagram URL" class="form-input" value="<?= e($settings['instagram'] ?? '') ?>">
            <input type="url" name="twitter" placeholder="Twitter URL" class="form-input" value="<?= e($settings['twitter'] ?? '') ?>">
            <input type="url" name="youtube" placeholder="YouTube URL" class="form-input" value="<?= e($settings['youtube'] ?? '') ?>">
        </div>
    </div>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">Working Hours</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <?php foreach (['mon'=>'Monday','tue'=>'Tuesday','wed'=>'Wednesday','thu'=>'Thursday','fri'=>'Friday','sat'=>'Saturday','sun'=>'Sunday'] as $key => $label): ?>
            <div class="flex items-center gap-3">
                <span class="w-24 text-sm font-medium"><?= $label ?></span>
                <input type="text" name="hours[<?= $key ?>]" class="form-input" value="<?= e($hours[$key] ?? 'Closed') ?>">
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">Notifications</h3>
        <div class="flex gap-6">
            <label class="flex items-center gap-2"><input type="checkbox" name="smtp_enabled" value="1" <?= ($settings['smtp_enabled'] ?? '0') === '1' ? 'checked' : '' ?>> Email Notifications</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="sms_enabled" value="1" <?= ($settings['sms_enabled'] ?? '0') === '1' ? 'checked' : '' ?>> SMS Notifications</label>
        </div>
        <p class="text-xs text-gray-400 mt-2">Requires server mail configuration (XAMPP sendmail) for email.</p>
    </div>

    <button type="submit" class="btn-primary px-8 py-3">Save Settings</button>
</form>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
