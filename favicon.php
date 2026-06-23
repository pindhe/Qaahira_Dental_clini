<?php
/**
 * Serves site favicon for browser auto-requests (/favicon.ico).
 */
require_once __DIR__ . '/config/config.php';

$path = APP_ROOT . '/assets/images/tablogo.jpeg';
$mime = 'image/jpeg';

$fav = setting('favicon');
if ($fav !== '') {
    $uploaded = UPLOAD_PATH . '/' . ltrim($fav, '/');
    if (is_file($uploaded)) {
        $path = $uploaded;
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $path) ?: 'image/png';
        finfo_close($finfo);
    }
}

if (!is_file($path)) {
    http_response_code(404);
    exit;
}

header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=604800');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;
