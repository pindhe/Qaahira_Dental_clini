<?php
require_once __DIR__ . '/../config/config.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $action = $_POST['action'] ?? 'update';

    if ($action === 'create') {
        $customerName = trim($_POST['customer_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $preferredDate = $_POST['preferred_date'] ?? '';
        $preferredTime = $_POST['preferred_time'] ?? '';
        $customerId = (int)($_POST['customer_id'] ?? 0);

        if ($customerId) {
            $customer = Database::fetch('SELECT * FROM customers WHERE id = ?', [$customerId]);
            if ($customer) {
                $customerName = $customer['name'];
                $email = $customer['email'];
                $phone = $customer['phone'] ?? $phone;
            }
        }

        if (!$customerName || !$email || !$phone || !$preferredDate || !$preferredTime) {
            flash('error', 'Please fill all required patient and schedule fields.');
            redirect(APP_URL . '/admin/appointments.php?new=1');
        }

        if (!$customerId) {
            $existing = Database::fetch('SELECT id FROM customers WHERE email = ?', [$email]);
            $customerId = $existing
                ? (int)$existing['id']
                : Database::insert('customers', ['name' => $customerName, 'email' => $email, 'phone' => $phone]);
        }

        Database::insert('appointments', [
            'customer_id' => $customerId,
            'customer_name' => $customerName,
            'email' => $email,
            'phone' => $phone,
            'service_id' => (int)($_POST['service_id'] ?? 0) ?: null,
            'dentist_id' => (int)($_POST['dentist_id'] ?? 0) ?: null,
            'preferred_date' => $preferredDate,
            'preferred_time' => $preferredTime,
            'notes' => trim($_POST['notes'] ?? ''),
            'status' => $_POST['status'] ?? 'approved',
            'admin_notes' => trim($_POST['admin_notes'] ?? ''),
        ]);

        flash('success', 'Appointment created successfully.');
        redirect(APP_URL . '/admin/appointments.php');
    }

    $id = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? '';
    $adminNotes = trim($_POST['admin_notes'] ?? '');
    $newDate = $_POST['preferred_date'] ?? '';
    $newTime = $_POST['preferred_time'] ?? '';

    if ($id && in_array($status, ['pending', 'approved', 'rejected', 'rescheduled', 'completed', 'cancelled'], true)) {
        $data = ['status' => $status, 'admin_notes' => $adminNotes];
        if ($newDate && $newTime) {
            $data['preferred_date'] = $newDate;
            $data['preferred_time'] = $newTime;
        }
        Database::update('appointments', $data, 'id = ?', [$id]);
        flash('success', 'Appointment updated.');
    }
    redirect(APP_URL . '/admin/appointments.php');
}

$adminPage = 'appointments';
$pageTitle = 'Manage Appointments';
require_once __DIR__ . '/includes/header.php';

$filter = $_GET['status'] ?? 'all';
$where = '1=1';
$params = [];
if ($filter !== 'all') {
    $where = 'a.status = ?';
    $params = [$filter];
}

$appointments = Database::fetchAll(
    "SELECT a.*, s.name as service_name, d.name as dentist_name FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     LEFT JOIN dentists d ON a.dentist_id = d.id
     WHERE {$where} ORDER BY a.created_at DESC",
    $params
);

$services = Database::fetchAll('SELECT id, name FROM services WHERE is_active = 1 ORDER BY name');
$dentists = Database::fetchAll('SELECT id, name FROM dentists WHERE is_active = 1 ORDER BY name');
$customers = Database::fetchAll('SELECT id, name, email, phone FROM customers ORDER BY name');
$showCreate = isset($_GET['new']);
$success = flash('success');
$error = flash('error');
$timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
?>

<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert-error mb-6"><?= e($error) ?></div><?php endif; ?>

<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div class="flex flex-wrap gap-2">
        <?php foreach (['all', 'pending', 'approved', 'rejected', 'rescheduled', 'completed', 'cancelled'] as $s): ?>
        <a href="?status=<?= $s ?>" class="px-4 py-2 rounded-lg text-sm font-medium <?= $filter === $s ? 'bg-dental text-white' : 'bg-white text-gray-600 hover:bg-gray-50' ?>">
            <?= ucfirst($s) ?>
        </a>
        <?php endforeach; ?>
    </div>
    <a href="?new=1<?= $filter !== 'all' ? '&status=' . e($filter) : '' ?>" class="btn-primary text-sm">+ New Appointment</a>
</div>

<?php if ($showCreate): ?>
<div class="stat-card rounded-2xl p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-navy text-lg">Create Appointment</h3>
        <a href="<?= APP_URL ?>/admin/appointments.php" class="text-sm text-gray-500 hover:text-dental">Cancel</a>
    </div>
    <form method="POST" class="grid md:grid-cols-2 gap-4">
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="create">

        <div class="md:col-span-2">
            <label class="text-sm font-medium block mb-1">Existing patient (optional)</label>
            <select name="customer_id" class="form-input" id="customerSelect">
                <option value="">— New patient —</option>
                <?php foreach ($customers as $c): ?>
                <option value="<?= $c['id'] ?>" data-name="<?= e($c['name']) ?>" data-email="<?= e($c['email']) ?>" data-phone="<?= e($c['phone'] ?? '') ?>">
                    <?= e($c['name']) ?> (<?= e($c['email']) ?>)
                </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div>
            <label class="text-sm font-medium block mb-1">Patient name *</label>
            <input type="text" name="customer_name" id="customerName" required class="form-input">
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Email *</label>
            <input type="email" name="email" id="customerEmail" required class="form-input">
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Phone *</label>
            <input type="tel" name="phone" id="customerPhone" required class="form-input">
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Status</label>
            <select name="status" class="form-input">
                <?php foreach (['approved', 'pending', 'rescheduled'] as $st): ?>
                <option value="<?= $st ?>"><?= ucfirst($st) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Service</label>
            <select name="service_id" class="form-input">
                <option value="">—</option>
                <?php foreach ($services as $s): ?>
                <option value="<?= $s['id'] ?>"><?= e($s['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Dentist</label>
            <select name="dentist_id" class="form-input">
                <option value="">—</option>
                <?php foreach ($dentists as $d): ?>
                <option value="<?= $d['id'] ?>"><?= e($d['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Date *</label>
            <input type="date" name="preferred_date" required class="form-input" min="<?= date('Y-m-d') ?>">
        </div>
        <div>
            <label class="text-sm font-medium block mb-1">Time *</label>
            <select name="preferred_time" required class="form-input">
                <option value="">—</option>
                <?php foreach ($timeSlots as $t): ?>
                <option value="<?= $t ?>:00"><?= format_time($t . ':00') ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="md:col-span-2">
            <label class="text-sm font-medium block mb-1">Patient notes</label>
            <textarea name="notes" rows="2" class="form-input"></textarea>
        </div>
        <div class="md:col-span-2">
            <label class="text-sm font-medium block mb-1">Admin notes</label>
            <textarea name="admin_notes" rows="2" class="form-input"></textarea>
        </div>
        <div class="md:col-span-2">
            <button type="submit" class="btn-primary">Create Appointment</button>
        </div>
    </form>
</div>
<script>
document.getElementById('customerSelect')?.addEventListener('change', function () {
    const opt = this.selectedOptions[0];
    const fill = !!this.value;
    ['customerName', 'customerEmail', 'customerPhone'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.readOnly = fill;
        if (fill) {
            el.value = ['data-name', 'data-email', 'data-phone'].map((a, j) => opt.getAttribute(a) || '')[i];
        }
    });
});
</script>
<?php endif; ?>

<div class="stat-card rounded-2xl overflow-x-auto">
    <table class="w-full text-sm">
        <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left">Patient</th>
            <th class="px-4 py-3 text-left">Service</th>
            <th class="px-4 py-3 text-left">Dentist</th>
            <th class="px-4 py-3 text-left">Date/Time</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-right">Actions</th>
        </tr></thead>
        <tbody>
        <?php if (!$appointments): ?>
        <tr><td colspan="6" class="px-4 py-8 text-center text-gray-400">No appointments yet. Click “New Appointment” to add one.</td></tr>
        <?php endif; ?>
        <?php foreach ($appointments as $a): ?>
        <tr class="border-t">
            <td class="px-4 py-3">
                <p class="font-medium"><?= e($a['customer_name']) ?></p>
                <p class="text-xs text-gray-400"><?= e($a['email']) ?> • <?= e($a['phone']) ?></p>
            </td>
            <td class="px-4 py-3"><?= e($a['service_name'] ?? '—') ?></td>
            <td class="px-4 py-3"><?= e($a['dentist_name'] ?? '—') ?></td>
            <td class="px-4 py-3"><?= format_date($a['preferred_date']) ?><br><span class="text-xs"><?= format_time($a['preferred_time']) ?></span></td>
            <td class="px-4 py-3"><?= status_badge($a['status']) ?></td>
            <td class="px-4 py-3 text-right">
                <button type="button" onclick="document.getElementById('modal-<?= $a['id'] ?>').classList.remove('hidden')" class="text-dental hover:underline">Manage</button>
            </td>
        </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php foreach ($appointments as $a): ?>
<div id="modal-<?= $a['id'] ?>" class="hidden fixed inset-0 admin-modal-overlay z-50 flex items-center justify-center p-4">
    <div class="admin-modal rounded-2xl p-6 w-full max-w-md">
        <h3 class="font-bold text-navy mb-4">Manage Appointment #<?= $a['id'] ?></h3>
        <form method="POST" class="space-y-4">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="update">
            <input type="hidden" name="id" value="<?= $a['id'] ?>">
            <select name="status" class="form-input">
                <?php foreach (['pending', 'approved', 'rejected', 'rescheduled', 'completed', 'cancelled'] as $st): ?>
                <option value="<?= $st ?>" <?= $a['status'] === $st ? 'selected' : '' ?>><?= ucfirst($st) ?></option>
                <?php endforeach; ?>
            </select>
            <div class="grid grid-cols-2 gap-2">
                <input type="date" name="preferred_date" value="<?= e($a['preferred_date']) ?>" class="form-input">
                <input type="time" name="preferred_time" value="<?= e(substr($a['preferred_time'], 0, 5)) ?>" class="form-input">
            </div>
            <textarea name="admin_notes" placeholder="Admin notes" class="form-input" rows="2"><?= e($a['admin_notes'] ?? '') ?></textarea>
            <div class="flex gap-2">
                <button type="submit" class="btn-primary flex-1">Save</button>
                <button type="button" onclick="this.closest('[id^=modal]').classList.add('hidden')" class="btn-outline flex-1">Cancel</button>
            </div>
        </form>
    </div>
</div>
<?php endforeach; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
