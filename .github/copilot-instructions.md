# WordPress Blog Copilot Instructions

## Architecture Overview
This is a **WordPress 6.5 + PHP-FPM blog** running on Docker Compose with external AWS RDS MySQL, designed for AWS EC2 free tier deployment. The stack comprises:
- **wordpress** container (PHP 8.2-FPM) - connects to external RDS, no local DB
- **nginx** container - SSL termination, reverse proxy to PHP-FPM on port 9000
- **certbot** - Let's Encrypt SSL for `blog.aseskahraba.com`

WordPress code lives in `./wp` (mounted to containers), with custom theme at `wp/wp-content/themes/aseskahraba`.

## Key Design Decisions
1. **No local database** - WordPress connects directly to AWS RDS endpoint for production-like development
2. **FPM architecture** - Nginx handles static files and forwards PHP requests to FPM container on port 9000
3. **Volume strategy** - `./wp` is bind-mounted (not a Docker volume) so theme edits are immediately reflected
4. **SSL-first** - Default Nginx config expects HTTPS, redirects HTTP → HTTPS

## Development Workflow

### Local Setup
```bash
cp .env.example .env
# Edit .env with your RDS endpoint (or local MySQL)
docker compose up -d
# Visit http://localhost:8080 to install WordPress
# Activate "Ases Kahraba" theme in Appearance → Themes
```

### Container Management
```bash
docker compose logs -f wordpress  # View WordPress/PHP logs
docker compose logs -f nginx      # View web server logs
docker compose restart nginx      # After config changes
docker compose down && docker compose up -d  # Full restart
```

### Theme Development
Edit files in `wp/wp-content/themes/aseskahraba/` directly - changes are hot-loaded. No build step required for this minimal theme.

## Project-Specific Conventions

### Brand Colors (CSS Variables)
Theme uses Ases Kahraba brand system defined in [style.css](wp/wp-content/themes/aseskahraba/style.css):
```css
--accent: #f5a623      /* Primary orange */
--background: #f9f7f3  /* Off-white */
--text: #1f1f1f        /* Near-black */
--muted: #4a4a4a       /* Gray */
```
Always use these CSS vars, not hardcoded colors.

### Helper Functions
[functions.php](wp/wp-content/themes/aseskahraba/functions.php) provides `ases_container_open()` and `ases_container_close()` for consistent 1100px max-width containers. Use in templates instead of manually writing `<div class="container">`.

### WordPress Menus
Two menu locations registered:
- `primary` - header navigation
- `footer` - footer links

### Environment Variables
Production WordPress URLs are set via `WORDPRESS_CONFIG_EXTRA` in `.env`:
```php
define('WP_HOME', 'https://blog.aseskahraba.com');
define('WP_SITEURL', 'https://blog.aseskahraba.com');
```
This overrides WordPress site URL settings for consistent production URLs.

## Deployment

### GitHub Actions Workflow
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) auto-deploys on `main` branch push:
1. Syncs repo to EC2 at `/opt/wordpress` via rsync
2. Generates `.env` from GitHub Secrets
3. Runs `docker compose up -d`
4. Issues/renews Let's Encrypt cert

### Required Secrets
Set in GitHub repository settings:
- `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` - SSH access
- `RDS_ENDPOINT`, `RDS_DB`, `RDS_USER`, `RDS_PASS` - Database credentials
- `WP_HOME`, `WP_SITEURL` - Production URLs (usually `https://blog.aseskahraba.com`)
- `LETSENCRYPT_EMAIL` - For SSL cert notifications

### Manual SSL Certificate Operations
```bash
# First-time cert issuance
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d blog.aseskahraba.com \
  --email you@example.com --agree-tos --no-eff-email

# Renewal (set up cron monthly)
docker compose run --rm certbot renew && docker compose restart nginx
```

## Critical Files

- [docker-compose.yml](docker-compose.yml) - Service definitions, no database service
- [nginx/conf.d/default.conf](nginx/conf.d/default.conf) - SSL config, PHP-FPM proxy rules
- [.env.example](.env.example) - Template with RDS connection vars
- [wp/wp-content/themes/aseskahraba/](wp/wp-content/themes/aseskahraba/) - Custom theme files

## Common Pitfalls

1. **Port 8080 vs 80** - Locally access via `http://localhost:8080`. Nginx listens on 80/443 internally, Docker maps to 8080 to avoid privileged ports.
2. **FPM vs Apache** - This uses FPM, so Nginx must handle static files. `.htaccess` files are ignored.
3. **SSL paths** - Nginx expects certs at `/etc/letsencrypt/live/blog.aseskahraba.com/`. Create dummy certs locally or comment out SSL server block for HTTP-only dev.
4. **RDS connectivity** - Ensure EC2 security group allows inbound MySQL (3306) from EC2 instance, and RDS security group allows connections.
