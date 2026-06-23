<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('gallery', 'id = ?', [$id]);
        flash('success', 'Image deleted.');
    } elseif ($action === 'save') {
        $data = [
            'title' => trim($_POST['title'] ?? ''),
            'title_ar' => trim($_POST['title_ar'] ?? ''),
            'category' => $_POST['category'] ?? 'clinic',
            'sort_order' => (int)($_POST['sort_order'] ?? 0),
        ];
        if (!empty($_FILES['image']['name'])) {
            $img = upload_file($_FILES['image'], 'gallery');
            if ($img) $data['image'] = $img;
        }
        if ($id || !empty($data['image'])) {
            if ($id) {
                Database::update('gallery', $data, 'id = ?', [$id]);
                flash('success', 'Image updated.');
            } else {
                Database::insert('gallery', $data);
                flash('success', 'Image uploaded.');
            }
        } else {
            flash('success', 'Please select an image to upload.');
        }
    }
    redirect(APP_URL . '/admin/gallery.php');
}

$adminPage = 'gallery';
$pageTitle = 'Manage Gallery';
require_once __DIR__ . '/includes/header.php';

$images = Database::fetchAll('SELECT * FROM gallery ORDER BY sort_order, id DESC');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM gallery WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Title', 'Category', 'Image', 'Settings'];
$galleryCategories = ['clinic' => 'Clinic', 'treatment' => 'Treatments', 'equipment' => 'Equipment', 'results' => 'Results', 'team' => 'Team'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('Gallery Images', count($images), 'gallery'); ?>
    <?php if (empty($images)): ?>
        <?php admin_crud_empty('No gallery images yet'); ?>
    <?php else: ?>
    <div class="admin-crud-grid">
        <?php foreach ($images as $img): ?>
        <div class="admin-crud-card">
            <img src="<?= e(upload_url($img['image'])) ?>" alt="<?= e($img['title']) ?>">
            <div class="admin-crud-card-body">
                <p class="font-medium text-sm truncate"><?= e($img['title'] ?: 'Untitled') ?></p>
                <p class="text-xs text-gray-400"><?= e($galleryCategories[$img['category']] ?? $img['category']) ?></p>
            </div>
            <div class="admin-crud-card-actions">
                <a href="?edit=<?= $img['id'] ?>" class="text-dental font-medium">Edit</a>
                <?= admin_crud_delete_form($img['id']) ?>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <?php admin_crud_fab('gallery', 'Upload New Image'); ?>

<?php else:
    admin_crud_form_shell_open('gallery', $edit ? 'Edit Image' : 'Upload New Image', $steps);
    admin_crud_form_open();
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Title</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Title (EN)</label><input type="text" name="title" class="form-input" value="<?= e($edit['title'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Title (AR)</label><input type="text" name="title_ar" class="form-input" value="<?= e($edit['title_ar'] ?? '') ?>"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Category</h3>
        <div class="max-w-sm">
            <label class="text-sm font-medium block mb-1">Gallery Category *</label>
            <select name="category" required class="form-input">
                <?php foreach ($galleryCategories as $val => $label): ?>
                <option value="<?= $val ?>" <?= ($edit['category'] ?? 'clinic') === $val ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Upload Image</h3>
        <?php if (!empty($edit['image'])): ?>
        <img src="<?= e(upload_url($edit['image'])) ?>" class="w-48 h-48 object-cover rounded-xl mb-4 border" alt="">
        <?php endif; ?>
        <label class="text-sm font-medium block mb-1"><?= $edit ? 'Replace Image' : 'Image' ?> <?= $edit ? '' : '*' ?></label>
        <input type="file" name="image" accept="image/*" class="form-input text-sm" <?= $edit ? '' : 'required' ?>>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Display Order</h3>
        <div class="max-w-xs">
            <label class="text-sm font-medium block mb-1">Sort Order</label>
            <input type="number" name="sort_order" class="form-input" value="<?= e($edit['sort_order'] ?? '0') ?>">
            <p class="text-xs text-gray-400 mt-2">Lower numbers appear first in the gallery.</p>
        </div>
    <?php admin_crud_step_close();

    admin_crud_form_actions('gallery', $edit ? 'Update Image' : 'Upload Image');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
