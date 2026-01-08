# Lambda Function for Blog API
resource "aws_lambda_function" "blog_api" {
  filename         = "${path.module}/../lambda-package.zip"
  function_name    = "${var.project_name}-api"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/../lambda-package.zip")
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size  # Default: 256MB (free tier: 128-3008MB, 1M free requests/month)
  timeout         = var.lambda_timeout      # Default: 15s (free tier: ok)

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV                = var.environment
      PROJECT_NAME            = var.project_name
      DB_NAME                 = var.db_name
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  # Tracing disabled for free tier
  tracing_config {
    mode = "PassThrough"  # Free tier: no additional charges
  }

  tags = {
    Name = "${var.project_name}-api-lambda"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy_attachment.lambda_vpc,
    aws_iam_role_policy_attachment.lambda_parameter_store,
    aws_cloudwatch_log_group.lambda_logs
  ]
}

# CloudWatch Log Group for Lambda - OPTIMIZED FOR FREE TIER
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-api"
  retention_in_days = 7  # Free tier: reduced from 14 to 7 days

  tags = {
    Name = "${var.project_name}-lambda-logs"
  }
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.blog_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.blog_api.execution_arn}/*/*"
}

# Lambda Alias for versioning
resource "aws_lambda_alias" "blog_api_live" {
  name             = "live"
  description      = "Live alias for blog API"
  function_name    = aws_lambda_function.blog_api.arn
  function_version = "$LATEST"
}

# Auto-scaling for Lambda (if using provisioned concurrency)
# Uncomment if needed for high traffic
# resource "aws_lambda_provisioned_concurrency_config" "blog_api" {
#   function_name                     = aws_lambda_function.blog_api.function_name
#   provisioned_concurrent_executions = 2
#   qualifier                         = aws_lambda_alias.blog_api_live.name
# }
