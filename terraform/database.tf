# RDS PostgreSQL Instance
resource "aws_db_instance" "blog_db" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # High availability options - DISABLED FOR FREE TIER
  multi_az               = false  # Free tier: single AZ only
  publicly_accessible    = false
  backup_retention_period = 1  # Free tier: 1 day only
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  # Performance Insights - DISABLED FOR FREE TIER
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = false  # Free tier: not included

  # Delete protection
  deletion_protection = false  # Free tier: allow deletion
  skip_final_snapshot = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  # Auto minor version upgrade
  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.project_name}-database"
  }
}

# AWS Systems Manager Parameter Store for Database Credentials - FREE TIER
# Parameter Store is completely free (no cost for standard parameters)
resource "aws_ssm_parameter" "db_connection_string" {
  name        = "/${var.project_name}/database/connection-string"
  description = "PostgreSQL connection string for ${var.project_name}"
  type        = "SecureString"
  value       = "postgresql://${aws_db_instance.blog_db.username}:${var.db_password}@${aws_db_instance.blog_db.endpoint}/${aws_db_instance.blog_db.db_name}"

  tags = {
    Name = "${var.project_name}-db-connection-string"
  }
}

resource "aws_ssm_parameter" "db_host" {
  name        = "/${var.project_name}/database/host"
  description = "PostgreSQL host for ${var.project_name}"
  type        = "String"
  value       = aws_db_instance.blog_db.endpoint

  tags = {
    Name = "${var.project_name}-db-host"
  }
}

resource "aws_ssm_parameter" "db_username" {
  name        = "/${var.project_name}/database/username"
  description = "PostgreSQL username for ${var.project_name}"
  type        = "String"
  value       = aws_db_instance.blog_db.username

  tags = {
    Name = "${var.project_name}-db-username"
  }
}

resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.project_name}/database/password"
  description = "PostgreSQL password for ${var.project_name}"
  type        = "SecureString"
  value       = var.db_password

  tags = {
    Name = "${var.project_name}-db-password"
  }
}

# CloudWatch Alarms for RDS - SIMPLIFIED FOR FREE TIER
resource "aws_cloudwatch_metric_alarm" "database_storage" {
  alarm_name          = "${var.project_name}-db-storage-space"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 1000000000 # 1 GB warning (more strict for free tier)
  alarm_description   = "Alert when database storage is running low"
  alarm_actions       = [] # Add SNS topic ARN for notifications

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.blog_db.id
  }
}
