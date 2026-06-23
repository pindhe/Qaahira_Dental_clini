<?php
/**
 * Public page bootstrap — load once before header
 */
if (!defined('APP_ROOT')) {
    require_once __DIR__ . '/../config/config.php';
    Language::init();
    track_visitor();
}
