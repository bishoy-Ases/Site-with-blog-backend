<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header>
  <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 24px;">
    <div style="display: flex; align-items: center; gap: 16px;">
      <img src="/wp-content/themes/aseskahraba/logo.png" alt="Ases Kahraba Logo" class="site-logo" />
      <span style="font-weight: 700; font-size: 2em; color: var(--text); letter-spacing: 1px;">Ases Kahraba</span>
    </div>
    <nav>
      <?php
      wp_nav_menu([
        'theme_location' => 'primary',
        'container' => false,
        'fallback_cb' => function () {
          echo '<ul><li><a href="' . home_url('/') . '">Home</a></li></ul>';
        },
      ]);
      ?>
    </nav>
  </div>
</header>
