<footer>
  <?php ases_container_open(); ?>
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span>&copy; <?php echo date('Y'); ?> Ases Kahraba</span>
      <nav><?php wp_nav_menu(['theme_location' => 'footer', 'container' => false]); ?></nav>
    </div>
  <?php ases_container_close(); ?>
</footer>
<?php wp_footer(); ?>
</body>
</html>
