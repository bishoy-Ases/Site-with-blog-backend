<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header>
  <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
    <a href="<?php echo esc_url(home_url('/')); ?>" style="font-weight: 700; font-size: 1.1rem; color: var(--text);">Ases Kahraba Blog</a>
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
