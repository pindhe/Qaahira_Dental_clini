<?php
require_once __DIR__ . '/bootstrap-public.php';

$pageTitle = $pageTitle ?? (isset($pageTitleKey) ? Language::t($pageTitleKey) : APP_NAME);
$metaDescription = $metaDescription ?? (Language::get() === 'ar' ? setting('meta_description_ar', setting('tagline_ar')) : setting('meta_description', setting('tagline')));
$metaKeywords = setting('meta_keywords', 'dental clinic, dentist');
$siteName = Language::get() === 'ar' ? setting('site_name_ar') : setting('site_name');
$ogImage = setting('og_image') ? upload_url(setting('og_image')) : (setting('hero_image') ? upload_url(setting('hero_image')) : APP_URL . '/assets/images/placeholder.svg');
$dir = Language::isRTL() ? 'rtl' : 'ltr';
$lang = Language::get();
$currentPage = current_page();
$navMenu = get_public_nav_menu();
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>" dir="<?= $dir ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= e($metaDescription) ?>">
    <meta name="keywords" content="<?= e($metaKeywords) ?>">
    <meta name="theme-color" content="#8B1E2D">
    <meta property="og:title" content="<?= e($pageTitle) ?> | <?= e($siteName) ?>">
    <meta property="og:description" content="<?= e($metaDescription) ?>">
    <meta property="og:image" content="<?= e($ogImage) ?>">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="<?= $lang === 'ar' ? 'ar_SA' : 'en_US' ?>">
    <?php render_favicon_meta(); ?>
    <link rel="manifest" href="<?= APP_URL ?>/manifest.json">
    <title><?= e($pageTitle) ?> | <?= e($siteName) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dental: { DEFAULT: '#E67E22', dark: '#cf6d1a', light: '#fdebd0' },
                        navy: { DEFAULT: '#8B1E2D', light: '#a82538' },
                        brand: { gray: '#E5E5E5', white: '#FFFFFF' },
                    },
                    fontFamily: {
                        sans: ['Inter', 'Segoe UI', 'Tahoma', 'sans-serif'],
                        arabic: ['Tajawal', 'Segoe UI', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= APP_URL ?>/assets/css/style.css?v=<?= filemtime(APP_ROOT . '/assets/css/style.css') ?>">
    <script>if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');</script>
</head>
<body id="publicBody" class="bg-brand-gray text-gray-800 transition-colors duration-300 <?= Language::isRTL() ? 'font-arabic' : 'font-sans' ?><?= !empty($isHome) ? ' page-home' : '' ?>">

<?php include __DIR__ . '/navbar.php'; ?>

<main class="<?= !empty($isHome) ? 'pt-0' : 'pt-20' ?> min-h-[50vh]">
