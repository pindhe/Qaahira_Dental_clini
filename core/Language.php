<?php

class Language
{
    private static string $lang = 'en';
    private static array $translations = [];

    public static function init(): void
    {
        if (isset($_GET['lang']) && in_array($_GET['lang'], ['en', 'ar'])) {
            $_SESSION['lang'] = $_GET['lang'];
        }
        self::$lang = $_SESSION['lang'] ?? 'en';
        $file = APP_ROOT . '/lang/' . self::$lang . '.php';
        if (file_exists($file)) {
            self::$translations = require $file;
        }
    }

    public static function get(): string
    {
        return self::$lang;
    }

    public static function isRTL(): bool
    {
        return self::$lang === 'ar';
    }

    public static function t(string $key, string $default = ''): string
    {
        return self::$translations[$key] ?? $default ?: $key;
    }

    public static function field(array $row, string $field): string
    {
        if (self::$lang === 'ar' && !empty($row[$field . '_ar'])) {
            return $row[$field . '_ar'];
        }
        return $row[$field] ?? '';
    }

    public static function switchUrl(): string
    {
        $newLang = self::$lang === 'en' ? 'ar' : 'en';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $uri = preg_replace('/[?&]lang=[^&]*/', '', $uri);
        $uri = rtrim($uri, '?&');
        $sep = str_contains($uri, '?') ? '&' : '?';
        return $uri . $sep . 'lang=' . $newLang;
    }
}
