<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('faqs', 'id = ?', [$id]);
        flash('success', 'FAQ deleted.');
    } elseif ($action === 'save') {
        $data = [
            'question' => trim($_POST['question']),
            'question_ar' => trim($_POST['question_ar'] ?? ''),
            'answer' => trim($_POST['answer']),
            'answer_ar' => trim($_POST['answer_ar'] ?? ''),
            'sort_order' => (int)($_POST['sort_order'] ?? 0),
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ];
        if ($id) {
            Database::update('faqs', $data, 'id = ?', [$id]);
            flash('success', 'FAQ updated.');
        } else {
            Database::insert('faqs', $data);
            flash('success', 'FAQ created.');
        }
    }
    redirect(APP_URL . '/admin/faqs.php');
}

$adminPage = 'faqs';
$pageTitle = 'Manage FAQs';
require_once __DIR__ . '/includes/header.php';

$faqs = Database::fetchAll('SELECT * FROM faqs ORDER BY sort_order');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM faqs WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Question', 'Answer', 'Settings', 'Confirm'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('FAQs', count($faqs), 'faqs'); ?>
    <div class="admin-crud-list">
        <table class="text-sm">
            <thead class="bg-gray-50"><tr>
                <th class="px-5 py-4 text-left">#</th>
                <th class="px-5 py-4 text-left">Question</th>
                <th class="px-5 py-4 text-left">Answer</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
            <?php foreach ($faqs as $f): ?>
            <tr class="border-t">
                <td class="px-5 py-4 text-gray-400"><?= $f['sort_order'] ?></td>
                <td class="px-5 py-4 font-semibold max-w-xs"><?= e($f['question']) ?></td>
                <td class="px-5 py-4 text-gray-500 max-w-md truncate"><?= e($f['answer']) ?></td>
                <td class="px-5 py-4"><?= admin_crud_status_badge((bool)$f['is_active']) ?></td>
                <td class="px-5 py-4 text-right space-x-3">
                    <a href="?edit=<?= $f['id'] ?>" class="text-dental hover:underline text-sm font-medium">Edit</a>
                    <?= admin_crud_delete_form($f['id']) ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($faqs)): ?>
            <tr><td colspan="5" class="px-5 py-16 text-center text-gray-400">No FAQs yet</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php admin_crud_fab('faqs', 'Create New FAQ'); ?>

<?php else:
    admin_crud_form_shell_open('faqs', $edit ? 'Edit FAQ' : 'Create New FAQ', $steps);
    admin_crud_form_open(' id="faqForm"');
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Question</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Question (EN) *</label><input type="text" name="question" required class="form-input" value="<?= e($edit['question'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Question (AR)</label><input type="text" name="question_ar" class="form-input" value="<?= e($edit['question_ar'] ?? '') ?>"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Answer</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Answer (EN) *</label><textarea name="answer" required class="form-input" rows="4"><?= e($edit['answer'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Answer (AR)</label><textarea name="answer_ar" class="form-input" rows="3"><?= e($edit['answer_ar'] ?? '') ?></textarea></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Settings</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Sort Order</label><input type="number" name="sort_order" class="form-input" value="<?= e($edit['sort_order'] ?? '0') ?>"></div>
            <div class="pt-6"><label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" <?= ($edit['is_active'] ?? 1) ? 'checked' : '' ?>> Active on FAQ page</label></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Confirm</h3>
        <p class="text-sm text-gray-500 mb-4">Review your FAQ entry before saving.</p>
        <div class="bg-dental/5 rounded-xl p-5 space-y-3">
            <div><span class="text-xs font-semibold text-dental uppercase">Question</span><p class="font-medium mt-1" id="preview-q"><?= e($edit['question'] ?? '—') ?></p></div>
            <div><span class="text-xs font-semibold text-dental uppercase">Answer</span><p class="text-sm text-gray-600 mt-1" id="preview-a"><?= e($edit['answer'] ?? '—') ?></p></div>
        </div>
        <script>
        document.getElementById('faqForm')?.addEventListener('input', () => {
            const q = document.querySelector('[name=question]')?.value || '—';
            const a = document.querySelector('[name=answer]')?.value || '—';
            document.getElementById('preview-q').textContent = q;
            document.getElementById('preview-a').textContent = a;
        });
        </script>
    <?php admin_crud_step_close();

    admin_crud_form_actions('faqs', $edit ? 'Update FAQ' : 'Create FAQ');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
