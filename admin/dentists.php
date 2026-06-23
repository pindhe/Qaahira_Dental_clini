<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('dentists', 'id = ?', [$id]);
        flash('success', 'Dentist deleted.');
    } elseif ($action === 'save') {
        $data = [
            'name' => trim($_POST['name']),
            'name_ar' => trim($_POST['name_ar'] ?? ''),
            'specialization' => trim($_POST['specialization'] ?? ''),
            'specialization_ar' => trim($_POST['specialization_ar'] ?? ''),
            'qualification' => trim($_POST['qualification'] ?? ''),
            'qualification_ar' => trim($_POST['qualification_ar'] ?? ''),
            'experience' => trim($_POST['experience'] ?? ''),
            'education' => trim($_POST['education'] ?? ''),
            'education_ar' => trim($_POST['education_ar'] ?? ''),
            'bio' => trim($_POST['bio'] ?? ''),
            'bio_ar' => trim($_POST['bio_ar'] ?? ''),
            'awards' => trim($_POST['awards'] ?? ''),
            'awards_ar' => trim($_POST['awards_ar'] ?? ''),
            'languages_spoken' => trim($_POST['languages_spoken'] ?? ''),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
            'sort_order' => (int)($_POST['sort_order'] ?? 0),
        ];
        if (!empty($_FILES['photo']['name'])) {
            $photo = upload_file($_FILES['photo'], 'dentists');
            if ($photo) $data['photo'] = $photo;
        }
        if ($id) {
            Database::update('dentists', $data, 'id = ?', [$id]);
            flash('success', 'Dentist updated.');
        } else {
            Database::insert('dentists', $data);
            flash('success', 'Dentist created.');
        }
    }
    redirect(APP_URL . '/admin/dentists.php');
}

$adminPage = 'dentists';
$pageTitle = 'Manage Dentists';
require_once __DIR__ . '/includes/header.php';

$dentists = Database::fetchAll('SELECT * FROM dentists ORDER BY sort_order, name');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM dentists WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Personal Info', 'Professional', 'Profile', 'Settings'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('Dentists', count($dentists), 'dentists'); ?>
    <div class="admin-crud-list">
        <table class="text-sm">
            <thead class="bg-gray-50"><tr>
                <th class="px-5 py-4 text-left">Dentist</th>
                <th class="px-5 py-4 text-left">Specialization</th>
                <th class="px-5 py-4 text-left">Experience</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
            <?php foreach ($dentists as $d): ?>
            <tr class="border-t">
                <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                        <?php if ($d['photo']): ?>
                        <img src="<?= e(upload_url($d['photo'])) ?>" class="w-10 h-10 rounded-full object-cover" alt="">
                        <?php else: ?>
                        <div class="w-10 h-10 rounded-full bg-dental/20 flex items-center justify-center font-bold text-dental text-sm"><?= e(substr($d['name'], 0, 1)) ?></div>
                        <?php endif; ?>
                        <div>
                            <p class="font-semibold"><?= e($d['name']) ?></p>
                            <p class="text-xs text-gray-400"><?= e($d['languages_spoken'] ?? '') ?></p>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-4 text-gray-500"><?= e($d['specialization'] ?? '—') ?></td>
                <td class="px-5 py-4"><?= e($d['experience'] ?? '—') ?></td>
                <td class="px-5 py-4"><?= admin_crud_status_badge((bool)$d['is_active']) ?></td>
                <td class="px-5 py-4 text-right space-x-3">
                    <a href="?edit=<?= $d['id'] ?>" class="text-dental hover:underline text-sm font-medium">Edit</a>
                    <?= admin_crud_delete_form($d['id'], 'Delete this dentist?') ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($dentists)): ?>
            <tr><td colspan="5" class="px-5 py-16 text-center text-gray-400">No dentists yet</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php admin_crud_fab('dentists', 'Create New Dentist'); ?>

<?php else:
    admin_crud_form_shell_open('dentists', $edit ? 'Edit Dentist' : 'Create New Dentist', $steps);
    admin_crud_form_open();
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Personal Information</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Full Name (EN) *</label><input type="text" name="name" required class="form-input" value="<?= e($edit['name'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Full Name (AR)</label><input type="text" name="name_ar" class="form-input" value="<?= e($edit['name_ar'] ?? '') ?>"></div>
            <div class="md:col-span-2"><label class="text-sm font-medium block mb-1">Photo</label>
                <?php if (!empty($edit['photo'])): ?><img src="<?= e(upload_url($edit['photo'])) ?>" class="h-16 w-16 rounded-full object-cover mb-2" alt=""><?php endif; ?>
                <input type="file" name="photo" accept="image/*" class="form-input text-sm"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Professional Details</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Specialization</label><input type="text" name="specialization" class="form-input" value="<?= e($edit['specialization'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Specialization (AR)</label><input type="text" name="specialization_ar" class="form-input" value="<?= e($edit['specialization_ar'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Qualification</label><input type="text" name="qualification" class="form-input" value="<?= e($edit['qualification'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Experience</label><input type="text" name="experience" class="form-input" placeholder="e.g. 12 years" value="<?= e($edit['experience'] ?? '') ?>"></div>
            <div class="md:col-span-2"><label class="text-sm font-medium block mb-1">Education</label><textarea name="education" class="form-input" rows="2"><?= e($edit['education'] ?? '') ?></textarea></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Profile & Awards</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Biography</label><textarea name="bio" class="form-input" rows="3"><?= e($edit['bio'] ?? '') ?></textarea></div>
            <div class="grid md:grid-cols-2 gap-4">
                <div><label class="text-sm font-medium block mb-1">Awards & Certifications</label><input type="text" name="awards" class="form-input" value="<?= e($edit['awards'] ?? '') ?>"></div>
                <div><label class="text-sm font-medium block mb-1">Languages Spoken</label><input type="text" name="languages_spoken" class="form-input" placeholder="English, Arabic" value="<?= e($edit['languages_spoken'] ?? '') ?>"></div>
            </div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Settings</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Sort Order</label><input type="number" name="sort_order" class="form-input" value="<?= e($edit['sort_order'] ?? '0') ?>"></div>
            <div class="pt-6"><label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" <?= ($edit['is_active'] ?? 1) ? 'checked' : '' ?>> Active on website</label></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_form_actions('dentists', $edit ? 'Update Dentist' : 'Create Dentist');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
