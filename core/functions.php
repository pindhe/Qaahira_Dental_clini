<?php

function e(?string $str): string
{
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION[CSRF_TOKEN_NAME])) {
        $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
    }
    return $_SESSION[CSRF_TOKEN_NAME];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

function verify_csrf(): bool
{
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    return hash_equals($_SESSION[CSRF_TOKEN_NAME] ?? '', $token);
}

function redirect(string $url): void
{
    header('Location: ' . $url);
    exit;
}

function flash(string $key, ?string $message = null): ?string
{
    if ($message !== null) {
        $_SESSION['flash'][$key] = $message;
        return null;
    }
    $msg = $_SESSION['flash'][$key] ?? null;
    unset($_SESSION['flash'][$key]);
    return $msg;
}

function setting(string $key, string $default = ''): string
{
    static $settings = null;
    if ($settings === null) {
        $rows = Database::fetchAll('SELECT setting_key, setting_value FROM settings');
        $settings = array_column($rows, 'setting_value', 'setting_key');
    }
    return $settings[$key] ?? $default;
}

function upsert_setting(string $key, string $value, string $group = 'general'): void
{
    $exists = Database::fetch('SELECT id FROM settings WHERE setting_key = ?', [$key]);
    if ($exists) {
        Database::update('settings', ['setting_value' => $value], 'setting_key = ?', [$key]);
    } else {
        Database::insert('settings', ['setting_key' => $key, 'setting_value' => $value, 'setting_group' => $group]);
    }
}

function satisfaction_rate(): int
{
    $stored = (int)setting('satisfaction_rate', '0');
    if ($stored > 0) return $stored;
    $avg = (float)(Database::fetch('SELECT AVG(rating) as a FROM testimonials WHERE is_active = 1')['a'] ?? 5);
    return (int)round(($avg / 5) * 100);
}

function display_stat(int $actual, int $minimum = 0, string $suffix = ''): string
{
    $value = max($actual, $minimum);
    $formatted = number_format($value);
    return $suffix ? $formatted . $suffix : $formatted;
}

function upload_file(array $file, string $subdir = ''): ?string
{
    if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] === 0) {
        return null;
    }

    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowed)) {
        return null;
    }

    $dir = UPLOAD_PATH . ($subdir ? '/' . $subdir : '');
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . strtolower($ext);
    $path = $dir . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $path)) {
        return ($subdir ? $subdir . '/' : '') . $filename;
    }
    return null;
}

function upload_url(?string $path): string
{
    if (!$path) return APP_URL . '/assets/images/placeholder.svg';
    return UPLOAD_URL . '/' . ltrim($path, '/');
}

function brand_logo_url(): string
{
    $logo = setting('site_logo');
    if ($logo !== '') {
        return upload_url($logo);
    }
    return APP_URL . '/assets/images/Navbarlogo.png';
}

function brand_logo_is_lockup(): bool
{
    return setting('site_logo') === '';
}

function nav_logo_url(): string
{
    return APP_URL . '/assets/images/tablogo.jpeg';
}

function whatsapp_number(): string
{
    $wa = setting('whatsapp');
    if ($wa !== '') {
        return preg_replace('/[^0-9]/', '', $wa);
    }
    return '252634953675';
}

function whatsapp_url(?string $message = null): string
{
    $url = 'https://wa.me/' . whatsapp_number();
    if ($message) {
        $url .= '?text=' . rawurlencode($message);
    }
    return $url;
}

function google_maps_embed_url(): string
{
    $embed = setting('map_embed');
    if ($embed !== '') {
        return $embed;
    }
    return 'https://maps.google.com/maps?q=9.5615997,44.0718104&hl=en&z=17&output=embed';
}

function google_maps_place_url(): string
{
    $url = setting('map_place_url');
    if ($url !== '') {
        return $url;
    }
    return 'https://www.google.com/maps/place/Qaahira+Denta+care/@9.5615997,44.0718104,17z';
}

function favicon_url(bool $withVersion = true): string
{
    $fav = setting('favicon');
    if ($fav !== '') {
        $url = upload_url($fav);
        if ($withVersion) {
            $path = UPLOAD_PATH . '/' . ltrim($fav, '/');
            if (is_file($path)) {
                $url .= '?v=' . filemtime($path);
            }
        }
        return $url;
    }

    $url = APP_URL . '/assets/images/tablogo.jpeg';
    if ($withVersion) {
        $path = APP_ROOT . '/assets/images/tablogo.jpeg';
        if (is_file($path)) {
            $url .= '?v=' . filemtime($path);
        }
    }
    return $url;
}

function favicon_mime(): string
{
    $fav = setting('favicon');
    if ($fav === '') {
        return 'image/jpeg';
    }
    return match (strtolower(pathinfo($fav, PATHINFO_EXTENSION))) {
        'jpg', 'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        default => 'image/png',
    };
}

function render_favicon_meta(): void
{
    $icon = e(favicon_url());
    $type = e(favicon_mime());
    echo '<link rel="icon" href="' . $icon . '" type="' . $type . '" sizes="32x32">' . "\n";
    echo '    <link rel="icon" href="' . $icon . '" type="' . $type . '" sizes="16x16">' . "\n";
    echo '    <link rel="shortcut icon" href="' . $icon . '" type="' . $type . '">' . "\n";
    echo '    <link rel="apple-touch-icon" href="' . $icon . '">' . "\n";
}

function track_visitor(): void
{
    try {
        Database::insert('visitors', [
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'page_url' => $_SERVER['REQUEST_URI'] ?? '',
        ]);
    } catch (Exception $e) {
        // Silently fail
    }
}

function create_notification(string $type, string $title, string $message, ?string $link = null): void
{
    Database::insert('notifications', [
        'type' => $type,
        'title' => $title,
        'message' => $message,
        'link' => $link,
    ]);
}

function get_analytics(): array
{
    $totalPatients = (int)(Database::fetch('SELECT COUNT(*) as c FROM customers')['c'] ?? 0);
    $totalAppointments = (int)(Database::fetch('SELECT COUNT(*) as c FROM appointments')['c'] ?? 0);
    $pending = (int)(Database::fetch("SELECT COUNT(*) as c FROM appointments WHERE status = 'pending'")['c'] ?? 0);
    $approved = (int)(Database::fetch("SELECT COUNT(*) as c FROM appointments WHERE status = 'approved'")['c'] ?? 0);
    $completed = (int)(Database::fetch("SELECT COUNT(*) as c FROM appointments WHERE status = 'completed'")['c'] ?? 0);
    $monthlyVisitors = (int)(Database::fetch(
        'SELECT COUNT(*) as c FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    )['c'] ?? 0);
    $todayVisitors = (int)(Database::fetch(
        'SELECT COUNT(*) as c FROM visitors WHERE DATE(visited_at) = CURDATE()'
    )['c'] ?? 0);
    $todayAppointments = (int)(Database::fetch(
        "SELECT COUNT(*) as c FROM appointments WHERE preferred_date = CURDATE()"
    )['c'] ?? 0);
    $upcomingAppointments = (int)(Database::fetch(
        "SELECT COUNT(*) as c FROM appointments
         WHERE preferred_date > CURDATE()
           AND preferred_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
           AND status IN ('pending', 'approved')"
    )['c'] ?? 0);
    $newPatientsMonth = (int)(Database::fetch(
        "SELECT COUNT(*) as c FROM customers WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')"
    )['c'] ?? 0);
    $appointmentsThisMonth = (int)(Database::fetch(
        "SELECT COUNT(*) as c FROM appointments WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')"
    )['c'] ?? 0);
    $appointmentsLastMonth = (int)(Database::fetch(
        "SELECT COUNT(*) as c FROM appointments
         WHERE created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
           AND created_at < DATE_FORMAT(NOW(), '%Y-%m-01')"
    )['c'] ?? 0);
    $unreadMessages = (int)(Database::fetch(
        'SELECT COUNT(*) as c FROM contact_messages WHERE is_read = 0 AND is_archived = 0'
    )['c'] ?? 0);
    $activeDentists = (int)(Database::fetch('SELECT COUNT(*) as c FROM dentists WHERE is_active = 1')['c'] ?? 0);
    $activeServices = (int)(Database::fetch('SELECT COUNT(*) as c FROM services WHERE is_active = 1')['c'] ?? 0);
    $publishedBlogs = (int)(Database::fetch('SELECT COUNT(*) as c FROM blogs WHERE is_published = 1')['c'] ?? 0);

    $popularServices = Database::fetchAll(
        'SELECT s.name, COUNT(a.id) as count FROM appointments a
         JOIN services s ON a.service_id = s.id
         GROUP BY a.service_id ORDER BY count DESC LIMIT 5'
    );

    $statusBreakdown = Database::fetchAll(
        "SELECT status, COUNT(*) as count FROM appointments GROUP BY status ORDER BY count DESC"
    );

    $revenue = (float)(Database::fetch(
        "SELECT COALESCE(SUM(s.price), 0) as total FROM appointments a
         JOIN services s ON a.service_id = s.id WHERE a.status = 'completed'"
    )['total'] ?? 0);

    $revenueThisMonth = (float)(Database::fetch(
        "SELECT COALESCE(SUM(s.price), 0) as total FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.status = 'completed' AND a.updated_at >= DATE_FORMAT(NOW(), '%Y-%m-01')"
    )['total'] ?? 0);

    $rawMonthlyRevenue = Database::fetchAll(
        "SELECT DATE_FORMAT(a.updated_at, '%Y-%m') as month, SUM(s.price) as revenue
         FROM appointments a JOIN services s ON a.service_id = s.id
         WHERE a.status = 'completed' AND a.updated_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
         GROUP BY month ORDER BY month"
    );

    $monthlyRevenue = [];
    for ($i = 5; $i >= 0; $i--) {
        $key = date('Y-m', strtotime("-{$i} months"));
        $label = date('M Y', strtotime("-{$i} months"));
        $found = array_filter($rawMonthlyRevenue, fn($r) => $r['month'] === $key);
        $monthlyRevenue[] = [
            'month' => $label,
            'revenue' => $found ? (float)array_values($found)[0]['revenue'] : 0,
        ];
    }

    $appointmentGrowth = $appointmentsLastMonth > 0
        ? round((($appointmentsThisMonth - $appointmentsLastMonth) / $appointmentsLastMonth) * 100, 1)
        : ($appointmentsThisMonth > 0 ? 100 : 0);

    return compact(
        'totalPatients', 'totalAppointments', 'pending', 'approved', 'completed',
        'monthlyVisitors', 'todayVisitors', 'todayAppointments', 'upcomingAppointments',
        'newPatientsMonth', 'appointmentsThisMonth', 'appointmentsLastMonth', 'appointmentGrowth',
        'unreadMessages', 'activeDentists', 'activeServices', 'publishedBlogs',
        'popularServices', 'statusBreakdown', 'revenue', 'revenueThisMonth', 'monthlyRevenue'
    );
}

function dashboard_greeting(): string
{
    $hour = (int)date('G');
    if ($hour < 12) return 'Good morning';
    if ($hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function time_ago(string $datetime): string
{
    $diff = time() - strtotime($datetime);
    if ($diff < 60) return 'Just now';
    if ($diff < 3600) return floor($diff / 60) . 'm ago';
    if ($diff < 86400) return floor($diff / 3600) . 'h ago';
    if ($diff < 604800) return floor($diff / 86400) . 'd ago';
    return format_date($datetime);
}

function format_price(float $price): string
{
    return number_format($price, 2) . ' SAR';
}

function format_date(string $date): string
{
    return date('M d, Y', strtotime($date));
}

function format_time(string $time): string
{
    return date('h:i A', strtotime($time));
}

function status_badge(string $status): string
{
    $classes = [
        'pending' => 'admin-status-pending',
        'approved' => 'admin-status-approved',
        'rejected' => 'admin-status-rejected',
        'rescheduled' => 'admin-status-rescheduled',
        'completed' => 'admin-status-completed',
        'cancelled' => 'admin-status-rejected',
    ];
    $class = $classes[$status] ?? 'admin-status-default';
    return '<span class="admin-status-badge ' . $class . '">' . e(ucfirst($status)) . '</span>';
}

function paginate(string $table, string $where = '1=1', array $params = [], int $perPage = 10): array
{
    $page = max(1, (int)($_GET['page'] ?? 1));
    $offset = ($page - 1) * $perPage;
    $total = Database::fetch("SELECT COUNT(*) as c FROM {$table} WHERE {$where}", $params)['c'] ?? 0;
    return [
        'page' => $page,
        'per_page' => $perPage,
        'total' => $total,
        'pages' => max(1, (int)ceil($total / $perPage)),
        'offset' => $offset,
    ];
}

function json_response(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function send_email_notification(string $to, string $subject, string $body): bool
{
    if (setting('smtp_enabled') !== '1') return false;
    $headers = "From: " . setting('email') . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    return @mail($to, $subject, $body, $headers);
}

function current_page(): string
{
    return basename($_SERVER['PHP_SELF'], '.php');
}

function nav_page_active(string $page, string $currentPage): bool
{
    $aliases = [
        'blog'     => ['blog-detail'],
        'services' => ['service-detail'],
        'index'    => ['index'],
    ];
    if ($page === $currentPage) {
        return true;
    }
    return in_array($currentPage, $aliases[$page] ?? [], true);
}

function nav_link_class(string $page, string $currentPage, bool $parentActive = false): string
{
    $isActive = $parentActive || nav_page_active($page, $currentPage);
    return $isActive
        ? 'text-dental bg-dental/10'
        : 'text-gray-600 dark:text-slate-300 hover:text-dental hover:bg-dental/5';
}

function get_public_nav_menu(): array
{
    $currentPage = current_page();

    return [
        ['type' => 'link', 'page' => 'index', 'label' => Language::t('home'), 'url' => APP_URL . '/'],
        [
            'type' => 'dropdown', 'label' => Language::t('about'), 'id' => 'about',
            'active' => in_array($currentPage, ['about', 'blog', 'blog-detail'], true),
            'children' => [
                ['page' => 'about', 'label' => Language::t('about'), 'url' => APP_URL . '/about.php'],
                ['page' => 'blog', 'label' => Language::t('blog'), 'url' => APP_URL . '/blog.php'],
            ],
        ],
        [
            'type' => 'dropdown', 'label' => Language::t('services'), 'id' => 'services',
            'active' => in_array($currentPage, ['services', 'gallery', 'service-detail'], true),
            'children' => [
                ['page' => 'services', 'label' => Language::t('services'), 'url' => APP_URL . '/services.php'],
                ['page' => 'gallery', 'label' => Language::t('gallery'), 'url' => APP_URL . '/gallery.php'],
            ],
        ],
        ['type' => 'link', 'page' => 'dentists', 'label' => Language::t('dentists'), 'url' => APP_URL . '/dentists.php'],
    ];
}

function render_public_navbar(): void
{
    $currentPage = current_page();
    $navMenu = get_public_nav_menu();
    include __DIR__ . '/../includes/navbar.php';
}

function render_public_footer(): void
{
    include __DIR__ . '/../includes/public-footer.php';
}

function footer_link_class(string $page): string
{
    return nav_page_active($page, current_page()) ? 'footer-link-active' : '';
}

