<?php
require_once __DIR__ . '/../config/config.php';

if (Auth::check()) {
    redirect(APP_URL . '/admin/index.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (Auth::attempt($email, $password)) {
        redirect(APP_URL . '/admin/index.php');
    }
    $error = 'Invalid email or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_favicon_meta(); ?>
    <title>Admin Login | Qaahira Dental</title>
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
                        dental: { DEFAULT: '#E67E22' },
                        navy: { DEFAULT: '#8B1E2D' },
                    },
                    fontFamily: { sans: ['Inter', 'Segoe UI', 'Tahoma', 'sans-serif'] }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/admin.css">
</head>
<body class="admin-login-page font-sans antialiased">
    <div class="admin-login-theme">
        <div class="theme-switch" role="group" aria-label="Theme">
            <button type="button" class="theme-switch-btn" data-theme="light" title="Light mode">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </button>
            <button type="button" class="theme-switch-btn" data-theme="dark" title="Dark mode">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
        </div>
    </div>

    <div class="admin-login-card">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-dental to-navy rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-sky-500/25">Q</div>
            <h1 class="text-2xl font-bold text-navy">Admin Login</h1>
            <p class="text-gray-500 text-sm mt-1">Qaahira Dental Clinic</p>
        </div>

        <?php if ($error): ?><div class="alert-error mb-4 text-sm"><?= e($error) ?></div><?php endif; ?>

        <form method="POST" class="space-y-5">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" required class="form-input" value="" autocomplete="email" placeholder="you@example.com">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" name="password" required class="form-input" autocomplete="current-password">
            </div>
            <button type="submit" class="btn-primary w-full py-3">Sign In</button>
        </form>
    </div>

    <script src="<?= APP_URL ?>/assets/js/admin.js"></script>
</body>
</html>
