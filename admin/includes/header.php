<?php
require_once __DIR__ . '/../../config/config.php';
Auth::requireAdmin();

$adminPage = $adminPage ?? 'dashboard';
$adminUser = Auth::user();
$unreadNotifications = Database::fetch('SELECT COUNT(*) as c FROM notifications WHERE is_read = 0')['c'] ?? 0;
$unreadMessages = Database::fetch('SELECT COUNT(*) as c FROM contact_messages WHERE is_read = 0 AND is_archived = 0')['c'] ?? 0;
$pendingAppointments = Database::fetch("SELECT COUNT(*) as c FROM appointments WHERE status = 'pending'")['c'] ?? 0;
$userInitials = strtoupper(substr($adminUser['name'], 0, 1));

$navItems = [
    ['dashboard', 'Dashboard', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
    ['dentists', 'Dentists', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
    ['services', 'Services', 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'],
    ['appointments', 'Appointments', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
    ['customers', 'Customers', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0'],
    ['messages', 'Messages', 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    ['testimonials', 'Testimonials', 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
    ['blog', 'Blog', 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'],
    ['gallery', 'Gallery', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'],
    ['faqs', 'FAQs', 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
    ['homepage', 'Homepage', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
    ['about', 'About Us', 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
    ['settings', 'Settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'],
    ['notifications', 'Notifications', 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_favicon_meta(); ?>
    <title><?= e($pageTitle ?? 'Admin') ?> | Qaahira Admin</title>
    <script>
        (function () {
            var t = localStorage.getItem('adminTheme');
            if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', t);
        })();
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dental: { DEFAULT: '#E67E22', dark: '#cf6d1a', light: '#fdebd0' },
                        navy: { DEFAULT: '#8B1E2D', light: '#a82538' },
                    },
                    fontFamily: { sans: ['Inter', 'Segoe UI', 'Tahoma', 'sans-serif'] }
                }
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/admin.css">
</head>
<body class="admin-layout font-sans antialiased" id="adminBody">
<div id="adminSidebarOverlay" class="admin-sidebar-overlay"></div>
<div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="admin-sidebar w-64 fixed h-full z-40 text-white flex flex-col" id="adminSidebar">
        <div class="p-5 border-b border-white/10">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-dental rounded-xl flex items-center justify-center font-bold shadow-lg shadow-sky-500/30">Q</div>
                <div>
                    <p class="font-bold text-sm tracking-tight">Qaahira Dental</p>
                    <p class="text-xs text-blue-300/80">Administration</p>
                </div>
            </div>
        </div>
        <nav class="flex-1 overflow-y-auto py-3">
            <?php foreach ($navItems as [$key, $label, $icon]): ?>
            <a href="<?= APP_URL ?>/admin/<?= $key === 'dashboard' ? 'index' : $key ?>.php"
               class="nav-link flex items-center gap-3 px-4 py-2.5 text-sm <?= $adminPage === $key ? 'active' : '' ?>">
                <svg class="w-5 h-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?= $icon ?>"/></svg>
                <span class="truncate"><?= e($label) ?></span>
                <?php if ($key === 'appointments' && $pendingAppointments > 0): ?>
                <span class="nav-badge ml-auto bg-yellow-400 text-yellow-900"><?= $pendingAppointments ?></span>
                <?php endif; ?>
                <?php if ($key === 'messages' && $unreadMessages > 0): ?>
                <span class="nav-badge ml-auto bg-red-500 text-white"><?= $unreadMessages ?></span>
                <?php endif; ?>
                <?php if ($key === 'notifications' && $unreadNotifications > 0): ?>
                <span class="nav-badge ml-auto bg-dental text-white"><?= $unreadNotifications ?></span>
                <?php endif; ?>
            </a>
            <?php endforeach; ?>
        </nav>
        <div class="p-4 border-t border-white/10 space-y-1">
            <a href="<?= APP_URL ?>" target="_blank" class="nav-link flex items-center gap-2 px-4 py-2 text-sm text-blue-300/90">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                View Website
            </a>
            <a href="<?= APP_URL ?>/admin/logout.php" class="nav-link flex items-center gap-2 px-4 py-2 text-sm text-red-400/90 hover:text-red-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Logout
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 admin-content">
        <header class="admin-topbar sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
                <button id="adminMenuBtn" type="button" class="admin-icon-btn lg:hidden shrink-0" aria-label="Open menu">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <div class="min-w-0">
                    <h1 class="page-title text-lg lg:text-xl font-bold truncate"><?= e($pageTitle ?? 'Dashboard') ?></h1>
                    <p class="text-xs text-gray-500 hidden sm:block"><?= date('l, F j, Y') ?></p>
                </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                <div class="theme-switch" role="group" aria-label="Theme">
                    <button type="button" class="theme-switch-btn" data-theme="light" title="Light mode">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    </button>
                    <button type="button" class="theme-switch-btn" data-theme="dark" title="Dark mode">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                    </button>
                </div>
                <a href="<?= APP_URL ?>/admin/notifications.php" class="admin-icon-btn relative" title="Notifications">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    <?php if ($unreadNotifications > 0): ?>
                    <span class="admin-notify-dot absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    <?php endif; ?>
                </a>
                <div class="user-chip hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full">
                    <span class="w-8 h-8 rounded-full bg-gradient-to-br from-dental to-navy text-white text-sm font-bold flex items-center justify-center"><?= e($userInitials) ?></span>
                    <span class="text-sm font-medium"><?= e($adminUser['name']) ?></span>
                </div>
            </div>
        </header>
        <main class="admin-main p-4 lg:p-8">
