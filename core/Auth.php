<?php

class Auth
{
    public static function attempt(string $email, string $password): bool
    {
        $admin = Database::fetch('SELECT * FROM admins WHERE email = ?', [$email]);
        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['name'];
            $_SESSION['admin_email'] = $admin['email'];
            session_regenerate_id(true);
            return true;
        }
        return false;
    }

    public static function check(): bool
    {
        return isset($_SESSION['admin_id']);
    }

    public static function user(): ?array
    {
        if (!self::check()) return null;
        return [
            'id' => $_SESSION['admin_id'],
            'name' => $_SESSION['admin_name'],
            'email' => $_SESSION['admin_email'],
        ];
    }

    public static function logout(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
    }

    public static function requireAdmin(): void
    {
        if (!self::check()) {
            header('Location: ' . APP_URL . '/admin/login.php');
            exit;
        }
    }
}
