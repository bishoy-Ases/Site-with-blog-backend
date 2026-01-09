<?php
// Theme setup
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus([
        'primary' => __('Primary Menu', 'aseskahraba'),
        'footer'  => __('Footer Menu', 'aseskahraba'),
    ]);
});

// Enqueue styles
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('aseskahraba-style', get_stylesheet_uri(), [], '0.1.0');
});

// Simple helper to output container
function ases_container_open() { echo '<div class="container">'; }
function ases_container_close() { echo '</div>'; }
