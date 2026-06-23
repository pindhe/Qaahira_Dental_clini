<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();
require_once __DIR__ . '/includes/crud-ui.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('blogs', 'id = ?', [$id]);
        flash('success', 'Post deleted.');
    } elseif ($action === 'save') {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', trim($_POST['title'])));
        $data = [
            'title' => trim($_POST['title']),
            'title_ar' => trim($_POST['title_ar'] ?? ''),
            'slug' => $slug,
            'excerpt' => trim($_POST['excerpt'] ?? ''),
            'excerpt_ar' => trim($_POST['excerpt_ar'] ?? ''),
            'content' => $_POST['content'] ?? '',
            'content_ar' => $_POST['content_ar'] ?? '',
            'author' => trim($_POST['author'] ?? 'Admin'),
            'category' => $_POST['category'] ?? 'dental-tips',
            'is_published' => isset($_POST['is_published']) ? 1 : 0,
            'published_at' => isset($_POST['is_published']) ? date('Y-m-d H:i:s') : null,
        ];
        if (!empty($_FILES['featured_image']['name'])) {
            $img = upload_file($_FILES['featured_image'], 'blog');
            if ($img) $data['featured_image'] = $img;
        }
        if ($id) {
            unset($data['slug']);
            Database::update('blogs', $data, 'id = ?', [$id]);
            flash('success', 'Post updated.');
        } else {
            Database::insert('blogs', $data);
            flash('success', 'Post created.');
        }
    }
    redirect(APP_URL . '/admin/blog.php');
}

$adminPage = 'blog';
$pageTitle = 'Manage Blog';
require_once __DIR__ . '/includes/header.php';

$blogs = Database::fetchAll('SELECT * FROM blogs ORDER BY created_at DESC');
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM blogs WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
$steps = ['Title & Author', 'Excerpt', 'Content', 'Publish'];
$blogCategories = ['dental-tips' => 'Dental Tips', 'oral-health' => 'Oral Health', 'cosmetic' => 'Cosmetic', 'children' => 'Children', 'news' => 'News'];
?>

<div class="admin-crud-page">
<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<?php if (!admin_crud_form_mode()): ?>
    <?php admin_crud_list_toolbar('Blog Posts', count($blogs), 'blog'); ?>
    <div class="admin-crud-list">
        <table class="text-sm">
            <thead class="bg-gray-50"><tr>
                <th class="px-5 py-4 text-left">Title</th>
                <th class="px-5 py-4 text-left">Category</th>
                <th class="px-5 py-4 text-left">Author</th>
                <th class="px-5 py-4 text-left">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
            <?php foreach ($blogs as $b): ?>
            <tr class="border-t">
                <td class="px-5 py-4 font-semibold"><?= e($b['title']) ?></td>
                <td class="px-5 py-4 text-gray-500"><?= e($blogCategories[$b['category'] ?? 'dental-tips'] ?? $b['category']) ?></td>
                <td class="px-5 py-4"><?= e($b['author']) ?></td>
                <td class="px-5 py-4"><?= $b['is_published'] ? '<span class="admin-status-badge admin-status-completed">Published</span>' : '<span class="admin-status-badge admin-status-default">Draft</span>' ?></td>
                <td class="px-5 py-4 text-right space-x-3">
                    <a href="?edit=<?= $b['id'] ?>" class="text-dental hover:underline text-sm font-medium">Edit</a>
                    <?= admin_crud_delete_form($b['id'], 'Delete this post?') ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($blogs)): ?>
            <tr><td colspan="5" class="px-5 py-16 text-center text-gray-400">No blog posts yet</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php admin_crud_fab('blog', 'Create New Post'); ?>

<?php else:
    admin_crud_form_shell_open('blog', $edit ? 'Edit Post' : 'Create New Post', $steps);
    admin_crud_form_open();
    echo '<input type="hidden" name="id" value="' . e($edit['id'] ?? '') . '">';

    admin_crud_step_open(1, true); ?>
        <h3>Step 1 — Title & Author</h3>
        <div class="grid md:grid-cols-2 gap-4">
            <div><label class="text-sm font-medium block mb-1">Title (EN) *</label><input type="text" name="title" required class="form-input" value="<?= e($edit['title'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Title (AR)</label><input type="text" name="title_ar" class="form-input" value="<?= e($edit['title_ar'] ?? '') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Author</label><input type="text" name="author" class="form-input" value="<?= e($edit['author'] ?? 'Admin') ?>"></div>
            <div><label class="text-sm font-medium block mb-1">Category</label>
                <select name="category" class="form-input">
                    <?php foreach ($blogCategories as $val => $label): ?>
                    <option value="<?= $val ?>" <?= ($edit['category'] ?? 'dental-tips') === $val ? 'selected' : '' ?>><?= e($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(2); ?>
        <h3>Step 2 — Excerpt</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Excerpt (EN)</label><textarea name="excerpt" class="form-input" rows="3"><?= e($edit['excerpt'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Excerpt (AR)</label><textarea name="excerpt_ar" class="form-input" rows="3"><?= e($edit['excerpt_ar'] ?? '') ?></textarea></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(3); ?>
        <h3>Step 3 — Content & Image</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-medium block mb-1">Content (EN)</label><textarea name="content" class="form-input" rows="6"><?= e($edit['content'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Content (AR)</label><textarea name="content_ar" class="form-input" rows="4"><?= e($edit['content_ar'] ?? '') ?></textarea></div>
            <div><label class="text-sm font-medium block mb-1">Featured Image</label>
                <?php if (!empty($edit['featured_image'])): ?><img src="<?= e(upload_url($edit['featured_image'])) ?>" class="h-24 rounded-lg mb-2 object-cover" alt=""><?php endif; ?>
                <input type="file" name="featured_image" accept="image/*" class="form-input text-sm"></div>
        </div>
    <?php admin_crud_step_close();

    admin_crud_step_open(4); ?>
        <h3>Step 4 — Publish Settings</h3>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" <?= ($edit['is_published'] ?? 0) ? 'checked' : '' ?>> Publish immediately on save</label>
        <p class="text-xs text-gray-400 mt-2">Uncheck to save as draft.</p>
    <?php admin_crud_step_close();

    admin_crud_form_actions('blog', $edit ? 'Update Post' : 'Publish Post');
endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
