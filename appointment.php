<?php
/**
 * Customer booking is disabled — appointments are created by admin only.
 * Redirect visitors to the contact page to send a message.
 */
require_once __DIR__ . '/config/config.php';

$params = [];
if (!empty($_GET['service'])) {
    $params['subject'] = 'Service inquiry';
}
if (!empty($_GET['dentist'])) {
    $params['subject'] = 'Dentist inquiry';
}

$url = APP_URL . '/contact.php';
if ($params) {
    $url .= '?' . http_build_query($params);
}

redirect($url);
