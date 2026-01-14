# EC2 Access Information

## Connection Details
- **Host**: 51.20.120.197
- **User**: ec2-user
- **SSH Key**: ~/Downloads/wp-admin.pem
- **WordPress Path**: /opt/wordpress

## Quick SSH Command
```bash
ssh -i ~/Downloads/wp-admin.pem ec2-user@51.20.120.197
```

## Fix WordPress Permissions
```bash
ssh -i ~/Downloads/wp-admin.pem ec2-user@51.20.120.197 "cd /opt/wordpress && sudo docker compose exec wordpress chown -R www-data:www-data /var/www/html/wp-content && sudo docker compose exec wordpress chmod -R 775 /var/www/html/wp-content"
```
