<?php
require_once __DIR__ . '/../config/config.php';
Auth::logout();
redirect(APP_URL . '/admin/login.php');
