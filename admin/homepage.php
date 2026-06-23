<?php
$adminPage = 'homepage';
$pageTitle = 'Homepage Content';
require_once __DIR__ . '/includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    foreach ($_POST['sections'] ?? [] as $key => $data) {
        Database::update('homepage_content', [
            'title' => trim($data['title'] ?? ''),
            'title_ar' => trim($data['title_ar'] ?? ''),
            'subtitle' => trim($data['subtitle'] ?? ''),
            'subtitle_ar' => trim($data['subtitle_ar'] ?? ''),
            'content' => trim($data['content'] ?? ''),
            'content_ar' => trim($data['content_ar'] ?? ''),
        ], 'section_key = ?', [$key]);
    }
    flash('success', 'Homepage updated.');
    redirect(APP_URL . '/admin/homepage.php');
}

$sections = Database::fetchAll('SELECT * FROM homepage_content ORDER BY id');
$success = flash('success');
?>

<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<form method="POST" class="space-y-6">
    <?= csrf_field() ?>
    <?php foreach ($sections as $s): ?>
    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4 capitalize"><?= e(str_replace('_', ' ', $s['section_key'])) ?></h3>
        <div class="grid md:grid-cols-2 gap-4">
            <input type="text" name="sections[<?= e($s['section_key']) ?>][title]" placeholder="Title (EN)" class="form-input" value="<?= e($s['title']) ?>">
            <input type="text" name="sections[<?= e($s['section_key']) ?>][title_ar]" placeholder="Title (AR)" class="form-input" value="<?= e($s['title_ar']) ?>">
            <input type="text" name="sections[<?= e($s['section_key']) ?>][subtitle]" placeholder="Subtitle (EN)" class="form-input" value="<?= e($s['subtitle']) ?>">
            <input type="text" name="sections[<?= e($s['section_key']) ?>][subtitle_ar]" placeholder="Subtitle (AR)" class="form-input" value="<?= e($s['subtitle_ar']) ?>">
            <textarea name="sections[<?= e($s['section_key']) ?>][content]" placeholder="Content (EN)" class="form-input" rows="3"><?= e($s['content']) ?></textarea>
            <textarea name="sections[<?= e($s['section_key']) ?>][content_ar]" placeholder="Content (AR)" class="form-input" rows="3"><?= e($s['content_ar']) ?></textarea>
        </div>
    </div>
    <?php endforeach; ?>
    <button type="submit" class="btn-primary px-8 py-3">Save Changes</button>
</form>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
