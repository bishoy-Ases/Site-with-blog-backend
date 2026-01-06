CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`is_admin` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text NOT NULL,
	`content_ar` text NOT NULL,
	`content_en` text NOT NULL,
	`excerpt_ar` text NOT NULL,
	`excerpt_en` text NOT NULL,
	`slug` text NOT NULL,
	`image_url` text,
	`published` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text NOT NULL,
	`description_ar` text NOT NULL,
	`description_en` text NOT NULL,
	`image_url` text,
	`category` text NOT NULL,
	`completion_date` integer,
	`featured` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text NOT NULL,
	`description_ar` text NOT NULL,
	`description_en` text NOT NULL,
	`icon` text,
	`featured` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_key` text NOT NULL,
	`content_ar` text NOT NULL,
	`content_en` text NOT NULL,
	`image_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_content_section_key_unique` ON `site_content` (`section_key`);--> statement-breakpoint
CREATE TABLE `store_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text NOT NULL,
	`description_ar` text NOT NULL,
	`description_en` text NOT NULL,
	`price` text,
	`image_url` text,
	`category` text NOT NULL,
	`featured` integer DEFAULT false,
	`in_stock` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`sess` text NOT NULL,
	`expire` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`profile_image_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);