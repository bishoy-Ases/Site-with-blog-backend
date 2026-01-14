<footer>
  <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px;">
    <div>
      <h4 style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">About</h4>
      <p style="font-size: 0.95rem; color: var(--text-light); margin: 0;">Professional electrical services and engineering expertise. 15+ years certified.</p>
    </div>
    <div>
      <h4 style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">Links</h4>
      <ul style="list-style: none; padding: 0; margin: 0;"><li><a href="<?php echo home_url('/'); ?>" style="font-size: 0.95rem; color: var(--text-light);">Home</a></li><li><a href="https://aseskahraba.com" target="_blank" style="font-size: 0.95rem; color: var(--text-light);">Main Site</a></li></ul>
    </div>
    <div>
      <h4 style="font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">Contact</h4>
      <p style="margin: 0; font-size: 0.95rem;"><a href="mailto:info@aseskahraba.com" style="color: var(--text-light);">info@aseskahraba.com</a></p>
    </div>
  </div>
  <div class="container" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border); text-align: center;">
      <footer>
        <div class="container" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/wp-content/themes/aseskahraba/logo.png" alt="Ases Kahraba Logo" class="site-logo" style="height:32px;" />
            <span style="font-weight: 600; font-size: 1.1em;">Ases Kahraba</span>
          </div>
          <nav>
            <?php wp_nav_menu(['theme_location' => 'footer', 'container' => false]); ?>
          </nav>
          <div class="muted" style="font-size:0.95em;">&copy; <?php echo date('Y'); ?> Ases Kahraba. All rights reserved.</div>
        </div>
      </footer>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
