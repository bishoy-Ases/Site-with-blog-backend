output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = aws_api_gateway_stage.main.invoke_url
}

output "api_gateway_id" {
  description = "API Gateway REST API ID"
  value       = aws_api_gateway_rest_api.blog_api.id
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.blog_db.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.blog_db.db_name
}

output "lambda_function_names" {
  description = "Lambda function names"
  value = {
    blog_api = aws_lambda_function.blog_api.function_name
  }
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "database_security_group_id" {
  description = "Database security group ID"
  value       = aws_security_group.rds.id
}
