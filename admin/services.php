<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('services', 'id = ?', [$id]);
        flash('success', 'Service deleted.');
    } elseif ($action === 'save') {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', trim($_POST['name'])));
        $data = [
            'category_id' => (int)($_POST['category_id'] ?? 0) ?: null,
            'name' => trim($_POST['name']),
            'name_ar' => trim($_POST['name_ar'] ?? ''),
            'slug' => $slug,
            'description' => trim($_POST['description'] ?? ''),
            'description_ar' => trim($_POST['description_ar'] ?? ''),
            'benefits' => trim($_POST['benefits'] ?? ''),
            'benefits_ar' => trim($_POST['benefits_ar'] ?? ''),
            'procedure_details' => trim($_POST['procedure_details'] ?? ''),
            'procedure_details_ar' => trim($_POST['procedure_details_ar'] ?? ''),
            'price' => (float)($_POST['price'] ?? 0),
            'duration' => (int)($_POST['duration'] ?? 30),
            'icon' => trim($_POST['icon'] ?? ''),
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'sort_order' => (int)($_POST['sort_order'] ?? 0),
        ];
        foreach (['image', 'before_image', 'after_image'] as $imgField) {
            if (!empty($_FILES[$imgField]['name'])) {
                $uploaded = upload_file($_FILES[$imgField], 'services');
                if ($uploaded) $data[$imgField] = $uploaded;
            }
        }
        if ($id) {
            unset($data['slug']);
            Database::update('services', $data, 'id = ?', [$id]);
            flash('success', 'Service updated.');
        } else {
            Database::insert('services', $data);
            flash('success', 'Service created.');
        }
    }
    redirect(APP_URL . '/admin/services.php');
}

$adminPage = 'services';
$pageTitle = 'Manage Services';
require_once __DIR__ . '/includes/header.php';

$services = Database::fetchAll('SELECT s.*, c.name as category_name FROM services s LEFT JOIN service_categories c ON s.category_id = c.id ORDER BY s.sort_order, s.name');
$categories = Database::fetchAll('SELECT * FROM service_categories ORDER BY name');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM services WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Basic Info', 'Description', 'Pricing & Media', 'Settings'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('Services', count($services), 'services'); ?>
    <div class="admin-crud-list">
        <table class="text-sm">
            <thead class="bg-gray-50"><tr>
                <th class="px-5 py-4 text-left">Service</th>
                <th class="px-5 py-4 text-left">Category</th>
                <th class="px-5 py-4 text-left">Price</th>
                <th class="px-5 py-4 text-left">Duration</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
            <?php foreach ($services as $s): ?>
            <tr class="border-t">
                <td class="px-5 py-4">
                    <p class="font-semibold"><?= e($s['name']) ?></p>
                    <?php if ($s['name_ar']): ?><p class="text-xs text-gray-400"><?= e($s['name_ar']) ?></p><?php endif; ?>
                </td>
                <td class="px-5 py-4 text-gray-500"><?= e($s['category_name'] ?? '—') ?></td>
                <td class="px-5 py-4 font-medium text-dental"><?= format_price($s['price']) ?></td>
                <td class="px-5 py-4"><?= $s['duration'] ?> min</td>
                <td class="px-5 py-4"><?= admin_crud_status_badge((bool)$s['is_active']) ?></td>
                <td class="px-5 py-4 text-right space-x-3">
                    <a href="?edit=<?= $s['id'] ?>" class="text-dental hover:underline text-sm font-medium">Edit</a>
                    <?= admin_crud_delete_form($s['id'], 'Delete this service?') ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($services)): ?>
            <tr><td colspan="6" class="px-5 py-16 text-center text-gray-400">No services yet</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php admin_crud_fab('services', 'Create New Service'); ?>

<?php else:
    admin_crud_form_shell_open('services', $edit ? 'Edit Service' : 'Create New Service', $steps);
    admin_crud_form_open();
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Basic Information</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Service Name (EN) *</label><input type="text" name="name" required class="form-input" value="<?= e($edit['name'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Service Name (AR)</label><input type="text" name="name_ar" class="form-input" value="<?= e($edit['name_ar'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Category</label>
                <select name="category_id" class="form-input">
                    <option value="">Select category</option>
                    <?php foreach ($categories as $c): ?>
                    <option value="<?= $c['id'] ?>" <?= ($edit['category_id'] ?? '') == $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div><label class="text-sm font-medium block mb-1">Icon</label><input type="text" name="icon" class="form-input" placeholder="e.g. sparkles" value="<?= e($edit['icon'] ?? '') ?>"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Description & Benefits</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Description (EN)</label><textarea name="description" class="form-input" rows="3"><?= e($edit['description'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Description (AR)</label><textarea name="description_ar" class="form-input" rows="3"><?= e($edit['description_ar'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Benefits</label><textarea name="benefits" class="form-input" rows="2"><?= e($edit['benefits'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Procedure Details</label><textarea name="procedure_details" class="form-input" rows="2"><?= e($edit['procedure_details'] ?? '') ?></textarea></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Pricing & Images</h3>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div><label class="text-sm font-medium block mb-1">Price (SAR) *</label><input type="number" name="price" step="0.01" required class="form-input" value="<?= e($edit['price'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Duration (minutes)</label><input type="number" name="duration" class="form-input" value="<?= e($edit['duration'] ?? '30') ?>"></div>
        </div>
        <div class="grid md:grid-cols-3 gap-4">
            <div><label class="text-sm font-medium block mb-1">Main Image</label><input type="file" name="image" accept="image/*" class="form-input text-sm" <?= $edit ? '' : '' ?>></div>
            <div><label class="text-sm font-medium block mb-1">Before Image</label><input type="file" name="before_image" accept="image/*" class="form-input text-sm"></div>
            <div><label class="text-sm font-medium block mb-1">After Image</label><input type="file" name="after_image" accept="image/*" class="form-input text-sm"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Settings</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Sort Order</label><input type="number" name="sort_order" class="form-input" value="<?= e($edit['sort_order'] ?? '0') ?>"></div>
            <div class="flex flex-col gap-3 pt-6">
                <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" <?= ($edit['is_featured'] ?? 0) ? 'checked' : '' ?>> Featured on homepage</label>
                <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" <?= ($edit['is_active'] ?? 1) ? 'checked' : '' ?>> Active (visible on website)</label>
            </div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_form_actions('services', $edit ? 'Update Service' : 'Create Service');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
