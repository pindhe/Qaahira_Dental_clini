<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('testimonials', 'id = ?', [$id]);
        flash('success', 'Testimonial deleted.');
    } elseif ($action === 'save') {
        $data = [
            'patient_name' => trim($_POST['patient_name']),
            'patient_name_ar' => trim($_POST['patient_name_ar'] ?? ''),
            'rating' => min(5, max(1, (int)($_POST['rating'] ?? 5))),
            'review' => trim($_POST['review']),
            'review_ar' => trim($_POST['review_ar'] ?? ''),
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ];
        if ($id) {
            Database::update('testimonials', $data, 'id = ?', [$id]);
            flash('success', 'Testimonial updated.');
        } else {
            Database::insert('testimonials', $data);
            flash('success', 'Testimonial created.');
        }
    }
    redirect(APP_URL . '/admin/testimonials.php');
}

$adminPage = 'testimonials';
$pageTitle = 'Manage Testimonials';
require_once __DIR__ . '/includes/header.php';

$items = Database::fetchAll('SELECT * FROM testimonials ORDER BY created_at DESC');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM testimonials WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Patient', 'Review', 'Rating', 'Settings'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('Testimonials', count($items), 'testimonials'); ?>
    <div class="admin-crud-list">
        <table class="text-sm">
            <thead class="bg-gray-50"><tr>
                <th class="px-5 py-4 text-left">Patient</th>
                <th class="px-5 py-4 text-left">Rating</th>
                <th class="px-5 py-4 text-left">Review</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
            <?php foreach ($items as $t): ?>
            <tr class="border-t">
                <td class="px-5 py-4 font-semibold"><?= e($t['patient_name']) ?></td>
                <td class="px-5 py-4 text-yellow-500"><?= str_repeat('★', (int)$t['rating']) ?></td>
                <td class="px-5 py-4 text-gray-500 max-w-xs truncate"><?= e($t['review']) ?></td>
                <td class="px-5 py-4"><?= admin_crud_status_badge((bool)$t['is_active']) ?></td>
                <td class="px-5 py-4 text-right space-x-3">
                    <a href="?edit=<?= $t['id'] ?>" class="text-dental hover:underline text-sm font-medium">Edit</a>
                    <?= admin_crud_delete_form($t['id']) ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($items)): ?>
            <tr><td colspan="5" class="px-5 py-16 text-center text-gray-400">No testimonials yet</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php admin_crud_fab('testimonials', 'Create New Testimonial'); ?>

<?php else:
    admin_crud_form_shell_open('testimonials', $edit ? 'Edit Testimonial' : 'Create New Testimonial', $steps);
    admin_crud_form_open();
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Patient Information</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Patient Name (EN) *</label><input type="text" name="patient_name" required class="form-input" value="<?= e($edit['patient_name'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Patient Name (AR)</label><input type="text" name="patient_name_ar" class="form-input" value="<?= e($edit['patient_name_ar'] ?? '') ?>"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Review Content</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Review (EN) *</label><textarea name="review" required class="form-input" rows="4"><?= e($edit['review'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Review (AR)</label><textarea name="review_ar" class="form-input" rows="3"><?= e($edit['review_ar'] ?? '') ?></textarea></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Star Rating</h3>
        <div class="max-w-xs">
            <label class="text-sm font-medium block mb-1">Rating *</label>
            <select name="rating" required class="form-input">
                <?php for ($i = 5; $i >= 1; $i--): ?>
                <option value="<?= $i ?>" <?= ($edit['rating'] ?? 5) == $i ? 'selected' : '' ?>><?= $i ?> Stars <?= str_repeat('★', $i) ?></option>
                <?php endfor; ?>
            </select>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Visibility Settings</h3>
        <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" <?= ($edit['is_featured'] ?? 0) ? 'checked' : '' ?>> Featured on homepage</label>
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" <?= ($edit['is_active'] ?? 1) ? 'checked' : '' ?>> Active (visible on website)</label>
        </div>
    <?php admin_crud_step_close();

    admin_crud_form_actions('testimonials', $edit ? 'Update Testimonial' : 'Create Testimonial');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
