#!/bin/bash

# Quick import script - imports existing resources directly without hanging on password prompt
# This script imports resources individually using terraform import

set -e

PROJECT_NAME="ases-blog"
REGION="eu-west-1"

cd "$(dirname "$0")"

echo "Initializing Terraform..."
terraform init -input=false -upgrade > /dev/null 2>&1

echo "Importing resources..."

# CloudWatch Log Groups
echo "✓ Importing CloudWatch Log Groups..."
terraform import -input=false aws_cloudwatch_log_group.api_gateway_logs "/aws/apigateway/$PROJECT_NAME" 2>/dev/null || echo "  (already imported or doesn't exist)"
terraform import -input=false aws_cloudwatch_log_group.lambda_logs "/aws/lambda/$PROJECT_NAME-api" 2>/dev/null || echo "  (already imported or doesn't exist)"

# IAM Roles
echo "✓ Importing IAM Roles..."
terraform import -input=false aws_iam_role.api_gateway_logs "$PROJECT_NAME-api-gateway-logs-role" 2>/dev/null || echo "  (already imported or doesn't exist)"
terraform import -input=false aws_iam_role.lambda_execution "$PROJECT_NAME-lambda-execution-role" 2>/dev/null || echo "  (already imported or doesn't exist)"

# SSM Parameter
echo "✓ Importing SSM Parameter..."
terraform import -input=false aws_ssm_parameter.db_password "/$PROJECT_NAME/database/password" 2>/dev/null || echo "  (already imported or doesn't exist)"

# RDS Subnet Group
echo "✓ Importing RDS DB Subnet Group..."
terraform import -input=false aws_db_subnet_group.main "$PROJECT_NAME-db-subnet-group" 2>/dev/null || echo "  (already imported or doesn't exist)"

echo ""
echo "Done! Run 'terraform plan' to see what's in state"
