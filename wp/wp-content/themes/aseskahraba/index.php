<?php get_header(); ?>
<main>
  <?php ases_container_open(); ?>
    <section style="padding:32px 0;">
      <h1><?php bloginfo('name'); ?></h1>
      <p><?php bloginfo('description'); ?></p>
    </section>

    <?php if (have_posts()) : ?>
      <div style="display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
        <?php while (have_posts()) : the_post(); ?>
          <article class="card">
            <?php if (has_post_thumbnail()) : ?>
              <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('medium_large'); ?></a>
            <?php endif; ?>
            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <p><?php echo wp_trim_words(get_the_excerpt(), 24); ?></p>
            <a class="btn-primary" href="<?php the_permalink(); ?>">Read more</a>
          </article>
        <?php endwhile; ?>
      </div>
    <?php else : ?>
      <p>No content found.</p>
    <?php endif; ?>
  <?php ases_container_close(); ?>
</main>
<?php get_footer(); ?>
