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

## Notes
- No local DB container is provided; WordPress connects directly to your RDS endpoint.
- Theme colors: accent `#f5a623`, background `#f9f7f3` to match aseskahraba.com.
- Nginx listens on 8080 → forwards PHP to `wordpress` FPM container.

## Deploying
- Point your domain to the host running this stack; set `WP_HOME` and `WP_SITEURL` in `.env` via `WORDPRESS_CONFIG_EXTRA`.
