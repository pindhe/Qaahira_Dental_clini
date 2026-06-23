<?php

function admin_crud_form_mode(): bool
{
    return isset($_GET['new']) || isset($_GET['edit']);
}

function admin_crud_back_url(string $page): string
{
    return APP_URL . '/admin/' . $page . '.php';
}

function admin_crud_list_toolbar(string $entityLabel, int $count, string $page, ?string $searchValue = null): void
{
    ?>
    <div class="admin-crud-toolbar mb-6">
        <div>
            <p class="text-sm text-gray-500"><?= number_format($count) ?> <?= e(strtolower($entityLabel)) ?> total</p>
        </div>
        <?php if ($searchValue !== null): ?>
        <form method="GET" class="admin-crud-search">
            <input type="text" name="q" value="<?= e($searchValue) ?>" placeholder="Search..." class="form-input">
            <button type="submit" class="btn-primary text-sm px-4 py-2">Search</button>
        </form>
        <?php endif; ?>
    </div>
    <?php
}

function admin_crud_fab(string $page, string $label = 'Create New'): void
{
    ?>
    <a href="<?= admin_crud_back_url($page) ?>?new=1" class="admin-crud-fab">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <?= e($label) ?>
    </a>
    <?php
}

function admin_crud_form_shell_open(string $page, string $title, array $steps): void
{
    $stepLabels = array_values($steps);
    ?>
    <div class="admin-crud-form-shell">
        <div class="flex items-center gap-4 mb-6">
            <a href="<?= admin_crud_back_url($page) ?>" class="admin-icon-btn" title="Back to list">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <h2 class="text-xl font-bold text-navy"><?= e($title) ?></h2>
        </div>

        <div class="admin-step-progress" data-total-steps="<?= count($stepLabels) ?>">
            <?php foreach ($stepLabels as $i => $label): $num = $i + 1; ?>
            <div class="admin-step-indicator<?= $num === 1 ? ' active' : '' ?>" data-step="<?= $num ?>">
                <span class="admin-step-num"><?= $num ?></span>
                <span class="admin-step-label"><?= e($label) ?></span>
            </div>
            <?php if ($num < count($stepLabels)): ?><div class="admin-step-line"></div><?php endif; ?>
            <?php endforeach; ?>
        </div>
    <?php
}

function admin_crud_form_open(string $extra = ''): void
{
    echo '<form method="POST" enctype="multipart/form-data" class="admin-step-form stat-card rounded-2xl p-6 lg:p-8 mt-6" ' . $extra . '>';
    echo csrf_field();
    echo '<input type="hidden" name="action" value="save">';
}

function admin_crud_step_open(int $step, bool $active = false): void
{
    $class = 'admin-step-panel' . ($active || $step === 1 ? ' active' : '');
    echo '<div class="' . $class . '" data-step="' . $step . '">';
}

function admin_crud_step_close(): void
{
    echo '</div>';
}

function admin_crud_form_actions(string $page, string $submitLabel = 'Save'): void
{
    ?>
        <div class="admin-step-actions mt-8 pt-6 border-t border-gray-100">
            <a href="<?= admin_crud_back_url($page) ?>" class="btn-outline px-6 py-2.5">Cancel</a>
            <div class="flex gap-3">
                <button type="button" class="btn-outline px-6 py-2.5 admin-step-back hidden">Back</button>
                <button type="button" class="btn-primary px-6 py-2.5 admin-step-next">Next Step</button>
                <button type="submit" class="btn-primary px-6 py-2.5 admin-step-submit hidden"><?= e($submitLabel) ?></button>
            </div>
        </div>
    </form>
    </div>
    <?php
}

function admin_crud_empty(string $message = 'No items yet'): void
{
    echo '<div class="admin-crud-empty stat-card rounded-2xl p-12 text-center text-gray-400">' . e($message) . '</div>';
}

function admin_crud_status_badge(bool $active, string $activeLabel = 'Active', string $inactiveLabel = 'Inactive'): string
{
    return $active
        ? '<span class="admin-status-badge admin-status-completed">' . e($activeLabel) . '</span>'
        : '<span class="admin-status-badge admin-status-default">' . e($inactiveLabel) . '</span>';
}

function admin_crud_delete_form(int $id, string $confirm = 'Delete this item?'): string
{
    return '<form method="POST" class="inline" onsubmit="return confirm(\'' . e($confirm) . '\')">'
        . csrf_field()
        . '<input type="hidden" name="action" value="delete">'
        . '<input type="hidden" name="id" value="' . $id . '">'
        . '<button type="submit" class="text-red-500 hover:underline text-sm">Delete</button></form>';
}
