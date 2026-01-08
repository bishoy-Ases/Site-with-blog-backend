# API Gateway REST API
resource "aws_api_gateway_rest_api" "blog_api" {
  name        = "${var.project_name}-api"
  description = "Blog API for Ases Kahraba"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${var.project_name}-api-gateway"
  }
}

# API Gateway Resource - /api
resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_rest_api.blog_api.root_resource_id
  path_part   = "api"
}

# API Gateway Resource - /api/blog
resource "aws_api_gateway_resource" "blog" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "blog"
}

# API Gateway Resource - /api/blog/{slug}
resource "aws_api_gateway_resource" "blog_slug" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_resource.blog.id
  path_part   = "{slug}"
}

# API Gateway Resource - /api/admin
resource "aws_api_gateway_resource" "admin" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "admin"
}

# API Gateway Resource - /api/admin/blog
resource "aws_api_gateway_resource" "admin_blog" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "blog"
}

# Proxy resource to catch all paths
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  parent_id   = aws_api_gateway_rest_api.blog_api.root_resource_id
  path_part   = "{proxy+}"
}

# ANY method for proxy resource
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

# Integration for proxy method
resource "aws_api_gateway_integration" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.blog_api.invoke_arn
}

# CORS Configuration
module "cors" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.blog_api.id
  api_resource_id = aws_api_gateway_resource.proxy.id

  allow_headers = [
    "Authorization",
    "Content-Type",
    "X-Amz-Date",
    "X-Api-Key",
    "X-Amz-Security-Token"
  ]
  allow_methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ]
  allow_origin = var.amplify_frontend_url
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy.id,
      aws_api_gateway_method.proxy.id,
      aws_api_gateway_integration.proxy.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.proxy
  ]
}

# API Gateway Stage - OPTIMIZED FOR FREE TIER
resource "aws_api_gateway_stage" "main" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
  stage_name    = var.environment

  # Disable caching for free tier
  cache_cluster_enabled = false  # Free tier: no caching

  # Enable logging
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
    })
  }

  # Disable X-Ray tracing for free tier
  xray_tracing_enabled = false  # Free tier: no X-Ray charges

  tags = {
    Name = "${var.project_name}-api-stage"
  }
}

# CloudWatch Log Group for API Gateway - OPTIMIZED FOR FREE TIER
resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "/aws/apigateway/${var.project_name}"
  retention_in_days = 7  # Free tier: reduced from 14 to 7 days

  tags = {
    Name = "${var.project_name}-api-gateway-logs"
  }
}

# API Gateway Method Settings
resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  stage_name  = aws_api_gateway_stage.main.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = var.environment != "prod"
    throttling_rate_limit  = 100
    throttling_burst_limit = 50
    caching_enabled        = var.environment == "prod" ? true : false
    cache_ttl_in_seconds   = 300
  }
}

# API Gateway Usage Plan
resource "aws_api_gateway_usage_plan" "main" {
  name        = "${var.project_name}-usage-plan"
  description = "Usage plan for ${var.project_name} API"

  api_stages {
    api_id = aws_api_gateway_rest_api.blog_api.id
    stage  = aws_api_gateway_stage.main.stage_name
  }

  quota_settings {
    limit  = 10000
    period = "DAY"
  }

  throttle_settings {
    rate_limit  = 100
    burst_limit = 50
  }

  tags = {
    Name = "${var.project_name}-usage-plan"
  }
}

# Custom Domain Name (Optional - uncomment if you have a domain)
# resource "aws_api_gateway_domain_name" "main" {
#   domain_name              = "api.aseskahraba.com"
#   regional_certificate_arn = var.certificate_arn
#
#   endpoint_configuration {
#     types = ["REGIONAL"]
#   }
#
#   tags = {
#     Name = "${var.project_name}-api-domain"
#   }
# }
#
# resource "aws_api_gateway_base_path_mapping" "main" {
#   api_id      = aws_api_gateway_rest_api.blog_api.id
#   stage_name  = aws_api_gateway_stage.main.stage_name
#   domain_name = aws_api_gateway_domain_name.main.domain_name
# }
