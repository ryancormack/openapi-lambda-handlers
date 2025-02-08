resource "aws_lambda_function" "get_cars" {
  function_name = "getcars"
  filename      = "../dist/getcars.zip"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  timeout       = 10
  memory_size   = 512
}

resource "aws_lambda_function" "post_cars" {
  function_name = "postcars"
  filename      = "../dist/postcars.zip"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  timeout       = 10
  memory_size   = 512
}

resource "aws_lambda_permission" "api_gateway_get_cars" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_cars.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cars_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_post_cars" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_cars.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.cars_api.execution_arn}/*/*"
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "cloudwatch_logs_policy" {
  name = "cloudwatch_logs_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:log-group:/aws/lambda/*" # Or your more specific resource ARN
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.cloudwatch_logs_policy.arn
}
