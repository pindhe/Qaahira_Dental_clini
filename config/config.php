<?php
/**
 * Qaahira Dental Clinic - Configuration
 */

define('APP_NAME', 'Qaahira Dental Clinic');
define('APP_URL', 'http://localhost/Dental');
define('APP_ROOT', dirname(__DIR__));
define('UPLOAD_PATH', APP_ROOT . '/uploads');
define('UPLOAD_URL', APP_URL . '/uploads');

// Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'qaahira_dental');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Security
define('SESSION_NAME', 'qaahira_session');
define('CSRF_TOKEN_NAME', 'csrf_token');

// Timezone
date_default_timezone_set('Asia/Riyadh');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_name(SESSION_NAME);
    session_start();
}

// Autoload core files
require_once APP_ROOT . '/core/Database.php';
require_once APP_ROOT . '/core/Auth.php';
require_once APP_ROOT . '/core/Language.php';
require_once APP_ROOT . '/core/functions.php';
