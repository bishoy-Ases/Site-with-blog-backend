variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ases-blog"
}

# Database Variables
variable "db_name" {
  description = "Database name"
  type        = string
  default     = "ases_blog"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "blogadmin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro" # Free tier eligible
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS (GB)"
  type        = number
  default     = 20
}

# Lambda Variables
variable "lambda_runtime" {
  description = "Lambda runtime version"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB (free tier: included up to 1M requests/month)"
  type        = number
  default     = 256  # Free tier: reduced from 512 to save compute time
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds (free tier: ok with shorter timeout)"
  type        = number
  default     = 15  # Free tier: reduced from 30
}

# Amplify Frontend URL
variable "amplify_frontend_url" {
  description = "Amplify frontend URL for CORS configuration"
  type        = string
  default     = "https://main.*.amplifyapp.com"
}

# VPC Variables
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for multi-AZ deployment"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}
