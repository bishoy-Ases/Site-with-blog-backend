# WordPress + External RDS (Ases Kahraba theme)

## Prereqs
- Docker + Docker Compose
- AWS RDS MySQL endpoint (or any MySQL-compatible DB)

## Setup
1) Copy env and fill values
```bash
cp .env.example .env
# edit .env with RDS host/user/password/db
```

2) Start stack
```bash
docker compose up -d
```
Visit http://localhost:8080 for WordPress install. Use the DB creds from `.env`.

3) Activate theme
- After WordPress installs, go to Appearance → Themes → activate **Ases Kahraba**.

4) Issue Let's Encrypt cert (blog.aseskahraba.com)
- Ensure DNS A record points to your EC2 public IP.
- Open ports 80/443 on the EC2 security group (free-tier t2.micro/t3.micro is fine).
- On the server, from the project directory:
	```bash
	docker compose run --rm certbot certonly \
		--webroot -w /var/www/certbot \
		-d blog.aseskahraba.com \
		--email you@example.com --agree-tos --no-eff-email
	docker compose restart nginx
	```
- Renewal (monthly cron):
	```bash
	docker compose run --rm certbot renew && docker compose restart nginx
	```

## Notes
- No local DB container is provided; WordPress connects directly to your RDS endpoint.
- Theme colors: accent `#f5a623`, background `#f9f7f3` to match aseskahraba.com.
- Nginx listens on 80/443 → forwards PHP to `wordpress` FPM container.
	- SSL paths expect Let's Encrypt certs at `/etc/letsencrypt/live/blog.aseskahraba.com/`.

## Deploying
- Point your domain to the host running this stack; set `WP_HOME` and `WP_SITEURL` in `.env` via `WORDPRESS_CONFIG_EXTRA`.
