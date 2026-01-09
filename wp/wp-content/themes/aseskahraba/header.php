<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header>
  <?php ases_container_open(); ?>
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <a href="<?php echo esc_url(home_url('/')); ?>" style="font-weight:700; font-size:1.1rem;">Ases Kahraba</a>
      <nav><?php wp_nav_menu(['theme_location' => 'primary', 'container' => false]); ?></nav>
    </div>
  <?php ases_container_close(); ?>
</header>
