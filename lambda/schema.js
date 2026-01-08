// PostgreSQL Schema for Lambda (converted from SQLite)
const { pgTable, serial, text, boolean, timestamp, integer } = require('drizzle-orm/pg-core');

// Blog Posts Table
const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  contentAr: text('content_ar').notNull(),
  contentEn: text('content_en').notNull(),
  excerptAr: text('excerpt_ar').notNull(),
  excerptEn: text('excerpt_en').notNull(),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
  blogPosts,
};
