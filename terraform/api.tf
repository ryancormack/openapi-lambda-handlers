resource "aws_api_gateway_rest_api" "cars_api" {
  name = "cars-api"
  body = templatefile("${path.module}/../openapi.json.tftpl", {
    region     = data.aws_region.current.name
    account_id = data.aws_caller_identity.current.account_id
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "cars_api" {
  rest_api_id = aws_api_gateway_rest_api.cars_api.id

  triggers = {
    redeployment = sha256(jsonencode(aws_api_gateway_rest_api.cars_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_rest_api.cars_api]
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name = "/aws/api_gateway/${aws_api_gateway_rest_api.cars_api.name}-logs"

  retention_in_days = 30 # Adjust as needed
}

resource "aws_iam_role" "api_gateway_cloudwatch_logs_role" {
  name = "api_gateway_cloudwatch_logs_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      },
    ]
  })
}
