terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: Configure S3 backend for state management
  # Uncomment and configure after creating S3 bucket
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "blog-backend/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-lock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Ases Kahraba Blog"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
