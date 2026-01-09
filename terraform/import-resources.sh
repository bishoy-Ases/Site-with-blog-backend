#!/bin/bash

# Script to import existing AWS resources into Terraform state
# This allows Terraform to manage resources that were already created

set -e

PROJECT_NAME="ases-blog"
REGION="eu-west-1"

echo "=========================================="
echo "Importing existing AWS resources into Terraform state"
echo "Project: $PROJECT_NAME"
echo "Region: $REGION"
echo "=========================================="

# Change to terraform directory
cd "$(dirname "$0")"

# Initialize Terraform (if not already done)
echo ""
echo "Initializing Terraform..."
terraform init

# Import CloudWatch Log Group for API Gateway
echo ""
echo "Importing CloudWatch Log Group for API Gateway..."
terraform import aws_cloudwatch_log_group.api_gateway_logs "/aws/apigateway/$PROJECT_NAME" || true

# Import IAM Role for API Gateway Logs
echo ""
echo "Importing IAM Role for API Gateway Logs..."
terraform import aws_iam_role.api_gateway_logs "$PROJECT_NAME-api-gateway-logs-role" || true

# Import IAM Policy for API Gateway Logs
echo ""
echo "Importing IAM Policy for API Gateway Logs..."
POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$PROJECT_NAME-api-gateway-logs-policy'].Arn" --output text)
if [ ! -z "$POLICY_ARN" ]; then
  terraform import aws_iam_policy.api_gateway_logs "$POLICY_ARN" || true
fi

# Import IAM Role Policy Attachment for API Gateway Logs
echo ""
echo "Importing IAM Role Policy Attachment for API Gateway Logs..."
terraform import aws_iam_role_policy_attachment.api_gateway_logs "$PROJECT_NAME-api-gateway-logs-role/$POLICY_ARN" || true

# Import SSM Parameter for Database Password
echo ""
echo "Importing SSM Parameter for Database Password..."
terraform import aws_ssm_parameter.db_password "/$PROJECT_NAME/database/password" || true

# Import IAM Role for Lambda Execution
echo ""
echo "Importing IAM Role for Lambda Execution..."
terraform import aws_iam_role.lambda_execution "$PROJECT_NAME-lambda-execution-role" || true

# Import IAM Policy for Lambda Parameter Store Access
echo ""
echo "Importing IAM Policy for Lambda Parameter Store..."
PARAM_POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$PROJECT_NAME-lambda-parameter-store-policy'].Arn" --output text)
if [ ! -z "$PARAM_POLICY_ARN" ]; then
  terraform import aws_iam_policy.lambda_parameter_store "$PARAM_POLICY_ARN" || true
fi

# Import IAM Policy for Lambda Logs
echo ""
echo "Importing IAM Policy for Lambda Logs..."
LOGS_POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$PROJECT_NAME-lambda-logs-policy'].Arn" --output text)
if [ ! -z "$LOGS_POLICY_ARN" ]; then
  terraform import aws_iam_policy.lambda_logs "$LOGS_POLICY_ARN" || true
fi

# Import CloudWatch Log Group for Lambda
echo ""
echo "Importing CloudWatch Log Group for Lambda..."
terraform import aws_cloudwatch_log_group.lambda_logs "/aws/lambda/$PROJECT_NAME-api" || true

# Import RDS DB Subnet Group
echo ""
echo "Importing RDS DB Subnet Group..."
terraform import aws_db_subnet_group.main "$PROJECT_NAME-db-subnet-group" || true

echo ""
echo "=========================================="
echo "Import complete!"
echo "Run 'terraform plan' to verify the state"
echo "=========================================="
