<?php
$adminPage = 'dashboard';
$pageTitle = 'Dashboard';
require_once __DIR__ . '/includes/header.php';

$stats = get_analytics();

$recentAppointments = Database::fetchAll(
    'SELECT a.*, s.name as service_name, d.name as dentist_name FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     LEFT JOIN dentists d ON a.dentist_id = d.id
     ORDER BY a.created_at DESC LIMIT 6'
);

$todaySchedule = Database::fetchAll(
    "SELECT a.*, s.name as service_name, d.name as dentist_name FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     LEFT JOIN dentists d ON a.dentist_id = d.id
     WHERE a.preferred_date = CURDATE()
     ORDER BY a.preferred_time ASC"
);

$upcomingSchedule = Database::fetchAll(
    "SELECT a.*, s.name as service_name, d.name as dentist_name FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     LEFT JOIN dentists d ON a.dentist_id = d.id
     WHERE a.preferred_date > CURDATE()
       AND a.preferred_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       AND a.status IN ('pending', 'approved')
     ORDER BY a.preferred_date ASC, a.preferred_time ASC
     LIMIT 5"
);

$recentMessages = Database::fetchAll(
    'SELECT * FROM contact_messages WHERE is_archived = 0 ORDER BY created_at DESC LIMIT 5'
);

$recentNotifications = Database::fetchAll(
    'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5'
);

$shortcuts = [
    [
        'url' => APP_URL . '/admin/appointments.php?status=pending',
        'label' => 'Pending',
        'desc' => 'Review requests',
        'badge' => $stats['pending'],
        'bg' => 'bg-yellow-100 text-yellow-700',
        'icon' => 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    ],
    [
        'url' => APP_URL . '/admin/appointments.php',
        'label' => 'Appointments',
        'desc' => 'Manage all',
        'badge' => $stats['todayAppointments'] > 0 ? $stats['todayAppointments'] : null,
        'badgeLabel' => 'today',
        'bg' => 'bg-blue-100 text-blue-700',
        'icon' => 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ],
    [
        'url' => APP_URL . '/admin/messages.php',
        'label' => 'Messages',
        'desc' => 'Contact inbox',
        'badge' => $stats['unreadMessages'],
        'bg' => 'bg-red-100 text-red-700',
        'icon' => 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    ],
    [
        'url' => APP_URL . '/admin/customers.php',
        'label' => 'Patients',
        'desc' => 'Customer list',
        'badge' => $stats['newPatientsMonth'] > 0 ? $stats['newPatientsMonth'] : null,
        'badgeLabel' => 'new',
        'bg' => 'bg-purple-100 text-purple-700',
        'icon' => 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
    ],
    [
        'url' => APP_URL . '/admin/services.php',
        'label' => 'Services',
        'desc' => $stats['activeServices'] . ' active',
        'bg' => 'bg-teal-100 text-teal-700',
        'icon' => 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    ],
    [
        'url' => APP_URL . '/admin/dentists.php',
        'label' => 'Dentists',
        'desc' => $stats['activeDentists'] . ' active',
        'bg' => 'bg-indigo-100 text-indigo-700',
        'icon' => 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    ],
    [
        'url' => APP_URL . '/admin/blog.php',
        'label' => 'Blog',
        'desc' => $stats['publishedBlogs'] . ' published',
        'bg' => 'bg-orange-100 text-orange-700',
        'icon' => 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    ],
    [
        'url' => APP_URL . '/admin/settings.php',
        'label' => 'Settings',
        'desc' => 'Clinic config',
        'bg' => 'bg-gray-100 text-gray-700',
        'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    ],
];

$statusColors = [
    'pending' => '#EAB308',
    'approved' => '#3B82F6',
    'rejected' => '#EF4444',
    'rescheduled' => '#A855F7',
    'completed' => '#22C55E',
];
?>

<!-- Welcome Banner -->
<div class="stat-card dashboard-banner rounded-2xl p-6 mb-8 text-white border-0">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <p class="text-blue-100 text-sm mb-1"><?= date('l, F j, Y') ?></p>
            <h2 class="text-2xl font-bold"><?= dashboard_greeting() ?>, <?= e($adminUser['name']) ?>!</h2>
            <p class="text-blue-100 text-sm mt-1">
                <?= $stats['todayAppointments'] ?> appointment<?= $stats['todayAppointments'] !== 1 ? 's' : '' ?> today
                &bull; <?= $stats['pending'] ?> pending review
                &bull; <?= $stats['unreadMessages'] ?> unread message<?= $stats['unreadMessages'] !== 1 ? 's' : '' ?>
            </p>
        </div>
        <div class="flex gap-3">
            <a href="<?= APP_URL ?>/admin/appointments.php?new=1"
               class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition">
                New Appointment
            </a>
            <a href="<?= APP_URL ?>" target="_blank"
               class="px-4 py-2 bg-white text-navy hover:bg-blue-50 rounded-xl text-sm font-medium transition">
                View Website
            </a>
        </div>
    </div>
</div>

<!-- Quick Shortcuts -->
<div class="mb-8">
    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Shortcuts</h3>
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <?php foreach ($shortcuts as $sc): ?>
        <a href="<?= $sc['url'] ?>" class="shortcut-card rounded-xl p-4 text-center group relative">
            <?php if (!empty($sc['badge'])): ?>
            <span class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                <?= $sc['badge'] ?>
            </span>
            <?php endif; ?>
            <div class="stat-icon <?= $sc['bg'] ?> mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?= $sc['icon'] ?>"/>
                </svg>
            </div>
            <p class="text-sm font-semibold text-navy"><?= e($sc['label']) ?></p>
            <p class="text-xs text-gray-400 mt-0.5"><?= e($sc['desc']) ?></p>
        </a>
        <?php endforeach; ?>
    </div>
</div>

<!-- Stats Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="stat-card rounded-2xl p-6">
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm text-gray-500 mb-1">Total Patients</p>
                <p class="text-3xl font-bold text-navy"><?= number_format($stats['totalPatients']) ?></p>
                <p class="text-xs text-green-600 mt-1">+<?= $stats['newPatientsMonth'] ?> this month</p>
            </div>
            <div class="stat-icon bg-purple-100 text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            </div>
        </div>
    </div>
    <div class="stat-card rounded-2xl p-6">
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm text-gray-500 mb-1">Appointments</p>
                <p class="text-3xl font-bold text-dental"><?= number_format($stats['totalAppointments']) ?></p>
                <p class="text-xs mt-1 <?= $stats['appointmentGrowth'] >= 0 ? 'text-green-600' : 'text-red-500' ?>">
                    <?= $stats['appointmentGrowth'] >= 0 ? '+' : '' ?><?= $stats['appointmentGrowth'] ?>% vs last month
                </p>
            </div>
            <div class="stat-icon bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
        </div>
    </div>
    <a href="<?= APP_URL ?>/admin/appointments.php?status=pending" class="stat-card rounded-2xl p-6 block">
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm text-gray-500 mb-1">Pending Review</p>
                <p class="text-3xl font-bold text-yellow-600"><?= number_format($stats['pending']) ?></p>
                <p class="text-xs text-gray-400 mt-1"><?= $stats['approved'] ?> approved &bull; <?= $stats['completed'] ?> done</p>
            </div>
            <div class="stat-icon bg-yellow-100 text-yellow-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
        </div>
    </a>
    <div class="stat-card rounded-2xl p-6">
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p class="text-3xl font-bold text-green-600"><?= format_price($stats['revenue']) ?></p>
                <p class="text-xs text-gray-400 mt-1"><?= format_price($stats['revenueThisMonth']) ?> this month</p>
            </div>
            <div class="stat-icon bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
        </div>
    </div>
</div>

<!-- Secondary Stats -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    <div class="stat-card rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-navy"><?= $stats['todayAppointments'] ?></p>
        <p class="text-xs text-gray-500">Today</p>
    </div>
    <div class="stat-card rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-dental"><?= $stats['upcomingAppointments'] ?></p>
        <p class="text-xs text-gray-500">Next 7 Days</p>
    </div>
    <div class="stat-card rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-navy"><?= number_format($stats['monthlyVisitors']) ?></p>
        <p class="text-xs text-gray-500">Visitors (30d)</p>
    </div>
    <div class="stat-card rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-dental"><?= $stats['todayVisitors'] ?></p>
        <p class="text-xs text-gray-500">Visitors Today</p>
    </div>
</div>

<!-- Charts Row -->
<div class="grid lg:grid-cols-3 gap-6 mb-8">
    <div class="lg:col-span-2 stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Monthly Revenue</h3>
            <span class="text-xs text-gray-400">Last 6 months</span>
        </div>
        <canvas id="revenueChart" height="120"></canvas>
    </div>
    <div class="stat-card rounded-2xl p-6">
        <h3 class="font-semibold text-navy mb-4">Appointment Status</h3>
        <div class="relative">
            <canvas id="statusChart" height="160"></canvas>
            <?php if (empty($stats['statusBreakdown'])): ?>
            <p class="text-sm text-gray-400 text-center py-8">No appointments yet</p>
            <?php endif; ?>
        </div>
        <div class="mt-4 pt-4 border-t">
            <h4 class="text-sm font-medium text-navy mb-3">Popular Services</h4>
            <div class="space-y-2">
                <?php foreach ($stats['popularServices'] as $ps): ?>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 truncate mr-2"><?= e($ps['name']) ?></span>
                    <span class="text-sm font-semibold text-dental shrink-0"><?= $ps['count'] ?></span>
                </div>
                <?php endforeach; ?>
                <?php if (empty($stats['popularServices'])): ?>
                <p class="text-sm text-gray-400">No data yet</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Schedule Row -->
<div class="grid lg:grid-cols-2 gap-6 mb-8">
    <div class="stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Today's Schedule</h3>
            <span class="text-xs bg-dental/10 text-dental px-2 py-1 rounded-full"><?= count($todaySchedule) ?> slots</span>
        </div>
        <div class="space-y-3">
            <?php foreach ($todaySchedule as $a): ?>
            <div class="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                <div class="text-center shrink-0 w-16">
                    <p class="text-sm font-bold text-dental"><?= format_time($a['preferred_time']) ?></p>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate"><?= e($a['customer_name']) ?></p>
                    <p class="text-xs text-gray-400 truncate"><?= e($a['service_name'] ?? 'N/A') ?> &bull; <?= e($a['dentist_name'] ?? 'Any') ?></p>
                </div>
                <?= status_badge($a['status']) ?>
            </div>
            <?php endforeach; ?>
            <?php if (empty($todaySchedule)): ?>
            <div class="text-center py-8">
                <svg class="w-12 h-12 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p class="text-sm text-gray-400">No appointments scheduled for today</p>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <div class="stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Upcoming (7 Days)</h3>
            <a href="<?= APP_URL ?>/admin/appointments.php" class="text-dental text-sm hover:underline">View All</a>
        </div>
        <div class="space-y-3">
            <?php foreach ($upcomingSchedule as $a): ?>
            <div class="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                <div class="text-center shrink-0 w-16">
                    <p class="text-xs text-gray-400"><?= date('M d', strtotime($a['preferred_date'])) ?></p>
                    <p class="text-sm font-bold text-navy"><?= format_time($a['preferred_time']) ?></p>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate"><?= e($a['customer_name']) ?></p>
                    <p class="text-xs text-gray-400 truncate"><?= e($a['service_name'] ?? 'N/A') ?></p>
                </div>
                <?= status_badge($a['status']) ?>
            </div>
            <?php endforeach; ?>
            <?php if (empty($upcomingSchedule)): ?>
            <div class="text-center py-8">
                <p class="text-sm text-gray-400">No upcoming appointments in the next 7 days</p>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Recent Activity Row -->
<div class="grid lg:grid-cols-3 gap-6">
    <div class="stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Recent Appointments</h3>
            <a href="<?= APP_URL ?>/admin/appointments.php" class="text-dental text-sm hover:underline">View All</a>
        </div>
        <div class="space-y-3">
            <?php foreach ($recentAppointments as $a): ?>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div class="min-w-0 mr-2">
                    <p class="font-medium text-sm truncate"><?= e($a['customer_name']) ?></p>
                    <p class="text-xs text-gray-400 truncate"><?= e($a['service_name'] ?? 'N/A') ?> &bull; <?= format_date($a['preferred_date']) ?></p>
                </div>
                <?= status_badge($a['status']) ?>
            </div>
            <?php endforeach; ?>
            <?php if (empty($recentAppointments)): ?>
            <p class="text-sm text-gray-400 text-center py-6">No appointments yet</p>
            <?php endif; ?>
        </div>
    </div>
    <div class="stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Recent Messages</h3>
            <a href="<?= APP_URL ?>/admin/messages.php" class="text-dental text-sm hover:underline">View All</a>
        </div>
        <div class="space-y-3">
            <?php foreach ($recentMessages as $m): ?>
            <a href="<?= APP_URL ?>/admin/messages.php" class="block py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition">
                <div class="flex items-start gap-2">
                    <?php if (!$m['is_read']): ?><span class="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0"></span><?php endif; ?>
                    <div class="min-w-0">
                        <p class="font-medium text-sm truncate"><?= e($m['name']) ?> — <?= e($m['subject']) ?></p>
                        <p class="text-xs text-gray-400 truncate"><?= e($m['message']) ?></p>
                        <p class="text-xs text-gray-300 mt-0.5"><?= time_ago($m['created_at']) ?></p>
                    </div>
                </div>
            </a>
            <?php endforeach; ?>
            <?php if (empty($recentMessages)): ?>
            <p class="text-sm text-gray-400 text-center py-6">No messages yet</p>
            <?php endif; ?>
        </div>
    </div>
    <div class="stat-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-navy">Notifications</h3>
            <a href="<?= APP_URL ?>/admin/notifications.php" class="text-dental text-sm hover:underline">View All</a>
        </div>
        <div class="space-y-3">
            <?php foreach ($recentNotifications as $n): ?>
            <div class="py-2 border-b border-gray-100 last:border-0 <?= !$n['is_read'] ? 'border-l-2 border-dental pl-3 -ml-3' : '' ?>">
                <p class="font-medium text-sm"><?= e($n['title']) ?></p>
                <p class="text-xs text-gray-400 truncate"><?= e($n['message']) ?></p>
                <p class="text-xs text-gray-300 mt-0.5"><?= time_ago($n['created_at']) ?></p>
            </div>
            <?php endforeach; ?>
            <?php if (empty($recentNotifications)): ?>
            <p class="text-sm text-gray-400 text-center py-6">No notifications</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<script>
function adminChartColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        grid: dark ? '#334155' : '#e2e8f0',
        text: dark ? '#94a3b8' : '#64748b',
    };
}
const colors = adminChartColors();
Chart.defaults.color = colors.text;
Chart.defaults.borderColor = colors.grid;

const revenueData = <?= json_encode($stats['monthlyRevenue']) ?>;
new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: {
        labels: revenueData.map(d => d.month),
        datasets: [{
            label: 'Revenue (SAR)',
            data: revenueData.map(d => d.revenue),
            backgroundColor: 'rgba(230, 126, 34, 0.75)',
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: colors.grid } },
            y: {
                beginAtZero: true,
                grid: { color: colors.grid },
                ticks: { callback: v => v.toLocaleString() + ' SAR' }
            }
        }
    }
});

const statusData = <?= json_encode($stats['statusBreakdown']) ?>;
const statusColors = <?= json_encode($statusColors) ?>;
if (statusData.length > 0) {
    new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
            labels: statusData.map(d => d.status.charAt(0).toUpperCase() + d.status.slice(1)),
            datasets: [{
                data: statusData.map(d => d.count),
                backgroundColor: statusData.map(d => statusColors[d.status] || '#94A3B8'),
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, padding: 12, font: { size: 11 }, color: colors.text }
                }
            }
        }
    });
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
