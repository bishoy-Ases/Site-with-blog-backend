<?php get_header(); ?>

<main class="container">
  <div class="page-title">Blog</div>
  
  <?php if (have_posts()) : ?>
    <div class="posts-grid">
      <?php
      while (have_posts()) {
        the_post();
        ?>
        <article class="post-card">
          <?php if (has_post_thumbnail()) : ?>
            <img class="post-card-image" src="<?php echo get_the_post_thumbnail_url('medium'); ?>" alt="<?php the_title(); ?>" />
          <?php else : ?>
            <div class="post-card-image" style="background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">No Image</div>
          <?php endif; ?>
          <div class="post-card-content">
            <div class="post-card-date"><?php echo get_the_date('M d, Y'); ?></div>
            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
            <p><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
            <a href="<?php the_permalink(); ?>" class="btn">Read More</a>
          </div>
        </article>
        <?php
      }
      ?>
    </div>
  <?php else : ?>
    <p>No posts found.</p>
  <?php endif; ?>
</main>

<?php get_footer(); ?>
