<?php
$adminPage = 'notifications';
$pageTitle = 'Notifications';
require_once __DIR__ . '/includes/header.php';

if (isset($_GET['read'])) {
    if ($_GET['read'] === 'all') {
        Database::query('UPDATE notifications SET is_read = 1');
    } else {
        Database::update('notifications', ['is_read' => 1], 'id = ?', [(int)$_GET['read']]);
    }
    redirect(APP_URL . '/admin/notifications.php');
}

$notifications = Database::fetchAll('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
?>

<div class="flex justify-between items-center mb-6">
    <p class="text-sm text-gray-500"><?= count(array_filter($notifications, fn($n) => !$n['is_read'])) ?> unread</p>
    <a href="?read=all" class="text-dental text-sm hover:underline">Mark all as read</a>
</div>

<div class="space-y-3">
    <?php foreach ($notifications as $n): ?>
    <div class="stat-card rounded-xl p-4 flex justify-between items-center <?= !$n['is_read'] ? 'border-l-4 border-dental' : '' ?>">
        <div>
            <p class="font-medium text-sm"><?= e($n['title']) ?></p>
            <p class="text-xs text-gray-500"><?= e($n['message']) ?> • <?= format_date($n['created_at']) ?></p>
        </div>
        <div class="flex gap-2 text-sm">
            <?php if ($n['link']): ?><a href="<?= APP_URL . $n['link'] ?>" class="text-dental">View</a><?php endif; ?>
            <?php if (!$n['is_read']): ?><a href="?read=<?= $n['id'] ?>" class="text-gray-400">Mark read</a><?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
    <?php if (empty($notifications)): ?><p class="text-gray-400 text-center py-12">No notifications</p><?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
