<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($action === 'delete' && $id) {
        Database::delete('customers', 'id = ?', [$id]);
        flash('success', 'Patient deleted.');
    } elseif ($action === 'save') {
        $data = [
            'name' => trim($_POST['name'] ?? ''),
            'email' => trim($_POST['email'] ?? ''),
            'phone' => trim($_POST['phone'] ?? ''),
        ];
        if ($id) {
            Database::update('customers', $data, 'id = ?', [$id]);
            flash('success', 'Patient updated.');
        } else {
            Database::insert('customers', $data);
            flash('success', 'Patient created.');
        }
    }
    redirect(APP_URL . '/admin/customers.php');
}

if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    $rows = Database::fetchAll('SELECT * FROM customers ORDER BY created_at DESC');
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="patients-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['ID', 'Name', 'Email', 'Phone', 'Joined']);
    foreach ($rows as $r) {
        fputcsv($out, [$r['id'], $r['name'], $r['email'], $r['phone'], $r['created_at']]);
    }
    fclose($out);
    exit;
}

$adminPage = 'customers';
$pageTitle = 'Manage Patients';
require_once __DIR__ . '/includes/header.php';

$search = trim($_GET['q'] ?? '');
$where = '1=1';
$params = [];
if ($search !== '') {
    $where = '(c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
    $params = ["%{$search}%", "%{$search}%", "%{$search}%"];
}

$customers = Database::fetchAll(
    "SELECT c.*, (SELECT COUNT(*) FROM appointments WHERE customer_id = c.id) as appointment_count
     FROM customers c WHERE {$where} ORDER BY c.created_at DESC",
    $params
);
$edit = isset($_GET['edit']) ? Database::fetch('SELECT * FROM customers WHERE id = ?', [(int)$_GET['edit']]) : null;
$success = flash('success');
?>

<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
    <form method="GET" class="flex gap-2 w-full sm:w-auto">
        <input type="text" name="q" value="<?= e($search) ?>" placeholder="Search patients..." class="form-input flex-1 sm:w-64">
        <button type="submit" class="btn-primary px-4 py-2 text-sm">Search</button>
    </form>
    <div class="flex gap-2">
        <a href="?export=csv" class="admin-pill px-4 py-2 rounded-lg text-sm">Export CSV</a>
        <a href="?add=1" class="btn-primary text-sm px-4 py-2">+ Add Patient</a>
    </div>
</div>

<?php if ($edit || isset($_GET['add'])): ?>
<div class="stat-card rounded-2xl p-6 mb-6 max-w-lg">
    <h3 class="font-semibold text-navy mb-4"><?= $edit ? 'Edit' : 'Add' ?> Patient</h3>
    <form method="POST" class="space-y-3">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $edit['id'] ?? '' ?>">
        <input type="text" name="name" required placeholder="Full Name" class="form-input" value="<?= e($edit['name'] ?? '') ?>">
        <input type="email" name="email" required placeholder="Email" class="form-input" value="<?= e($edit['email'] ?? '') ?>">
        <input type="text" name="phone" placeholder="Phone" class="form-input" value="<?= e($edit['phone'] ?? '') ?>">
        <div class="flex gap-2">
            <button type="submit" class="btn-primary flex-1">Save</button>
            <a href="<?= APP_URL ?>/admin/customers.php" class="btn-outline flex-1 text-center py-3">Cancel</a>
        </div>
    </form>
</div>
<?php endif; ?>

<div class="stat-card rounded-2xl overflow-x-auto">
    <table class="w-full text-sm">
        <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Phone</th>
            <th class="px-4 py-3 text-left">Appointments</th>
            <th class="px-4 py-3 text-left">Joined</th>
            <th class="px-4 py-3 text-right">Actions</th>
        </tr></thead>
        <tbody>
        <?php foreach ($customers as $c): ?>
        <tr class="border-t">
            <td class="px-4 py-3 font-medium"><?= e($c['name']) ?></td>
            <td class="px-4 py-3"><?= e($c['email']) ?></td>
            <td class="px-4 py-3"><?= e($c['phone']) ?></td>
            <td class="px-4 py-3"><?= $c['appointment_count'] ?></td>
            <td class="px-4 py-3 text-gray-400"><?= format_date($c['created_at']) ?></td>
            <td class="px-4 py-3 text-right space-x-2">
                <a href="?edit=<?= $c['id'] ?>" class="text-dental hover:underline">Edit</a>
                <form method="POST" class="inline" onsubmit="return confirm('Delete this patient?')">
                    <?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= $c['id'] ?>">
                    <button type="submit" class="text-red-500 hover:underline">Delete</button>
                </form>
            </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($customers)): ?>
        <tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">No patients found</td></tr>
        <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
