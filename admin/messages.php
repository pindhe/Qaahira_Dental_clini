<?php
$adminPage = 'messages';
$pageTitle = 'Contact Messages';
require_once __DIR__ . '/includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf()) {
    $id = (int)($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';

    if ($action === 'reply' && $id) {
        Database::update('contact_messages', [
            'reply' => trim($_POST['reply']),
            'replied_at' => date('Y-m-d H:i:s'),
            'is_read' => 1,
        ], 'id = ?', [$id]);
        $msg = Database::fetch('SELECT * FROM contact_messages WHERE id = ?', [$id]);
        if ($msg) send_email_notification($msg['email'], 'Re: ' . $msg['subject'], nl2br(e($_POST['reply'])));
        flash('success', 'Reply sent.');
    } elseif ($action === 'archive' && $id) {
        Database::update('contact_messages', ['is_archived' => 1, 'is_read' => 1], 'id = ?', [$id]);
        flash('success', 'Message archived.');
    }
    redirect(APP_URL . '/admin/messages.php');
}

$showArchived = isset($_GET['archived']);
$where = $showArchived ? 'is_archived = 1' : 'is_archived = 0';
$messages = Database::fetchAll("SELECT * FROM contact_messages WHERE {$where} ORDER BY created_at DESC");
$success = flash('success');
?>

<?php if ($success): ?><div class="alert-success mb-6"><?= e($success) ?></div><?php endif; ?>

<div class="flex gap-2 mb-6">
    <a href="?" class="px-4 py-2 rounded-lg text-sm <?= !$showArchived ? 'bg-dental text-white' : 'bg-white' ?>">Inbox</a>
    <a href="?archived=1" class="px-4 py-2 rounded-lg text-sm <?= $showArchived ? 'bg-dental text-white' : 'bg-white' ?>">Archived</a>
</div>

<div class="space-y-4">
    <?php foreach ($messages as $m): ?>
    <div class="stat-card rounded-2xl p-6 <?= !$m['is_read'] ? 'border-l-4 border-dental' : '' ?>">
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="font-semibold text-navy"><?= e($m['subject']) ?></h3>
                <p class="text-sm text-gray-500"><?= e($m['name']) ?> &lt;<?= e($m['email']) ?>&gt; • <?= format_date($m['created_at']) ?></p>
            </div>
            <?php if (!$m['is_read']): ?><span class="text-xs bg-dental text-white px-2 py-1 rounded-full">New</span><?php endif; ?>
        </div>
        <p class="text-gray-600 mb-4"><?= nl2br(e($m['message'])) ?></p>
        <?php if ($m['reply']): ?>
        <div class="bg-dental/5 rounded-lg p-4 mb-4"><p class="text-sm font-medium text-dental mb-1">Your Reply:</p><p class="text-sm"><?= nl2br(e($m['reply'])) ?></p></div>
        <?php endif; ?>
        <?php if (!$showArchived): ?>
        <form method="POST" class="space-y-3">
            <?= csrf_field() ?>
            <input type="hidden" name="id" value="<?= $m['id'] ?>">
            <textarea name="reply" placeholder="Write a reply..." class="form-input" rows="3"></textarea>
            <div class="flex gap-2">
                <button type="submit" name="action" value="reply" class="btn-primary text-sm py-2 px-4">Send Reply</button>
                <button type="submit" name="action" value="archive" class="btn-outline text-sm py-2 px-4">Archive</button>
            </div>
        </form>
        <?php endif; ?>
    </div>
    <?php endforeach; ?>
    <?php if (empty($messages)): ?><p class="text-gray-400 text-center py-12">No messages</p><?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
