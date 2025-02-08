# Typescript decorator integration to support scaffolding AWS API Gateways

## Summary

This example repo shows how you can add multiple Lambda function 'handlers' for various routes and methods, without having to add the overhead of large API Gateway Terraform configuration. The decorator and generation script allow you to generate OpenAPI specs from your handlers which gets passed into the Terraform.

## Usage

The repo is essentially split into 3 parts. The openapi generation, the source code and the terraform.

The openapi part could/would be an npm package the user can use to decorate their handlers. The source code can contain any number of API handlers in the src/handlers folder.

The Terraform looks for the well known path to the generated OpenAPI spec file. You still need to configure the Lambda function Terraform for any new handler you add.

## Quirks

There is an assumption that the Function name is the to-lower-case value of the typescript file. That value gets used in the `x-amazon-apigateway-integration` block in the API Spec.

## Adding a new endpoint

Add a new handler, something like listAllCars.mts and add the decorator. An example of this may be:

```
export class ListAllCars {
    @ApiRoute(
        'GET',
        '/cars/',
        undefined, //no request body
        [
              { 
                statusCode: 200,
                description: "Car got successfully",
                schema: z.array(CarSchema)
              },
              {
                statusCode: 400,
                description: "Invalid request",
                schema: ErrorSchema
              },
              {
                statusCode: 500,
                description: "Internal server error",
                schema: ErrorSchema
              }
            ]
    )
    async handler(event: APIGatewayProxyEvent): 
    //rest
```
Then ensure you update the lambda.tf Terraform file to include the new definition. Then run `npm run generate-openapi` and `npm run build`.
This will build you new endpoint and generate your new spec. You can then run `terraform plan && terraform apply` from the `terraform/` directory