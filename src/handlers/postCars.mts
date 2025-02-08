import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { ApiRoute } from "../../openapi/decorators/ApiRoute.js";

const CarSchema = z.object({
  make: z.string(),
  model: z.string(),
});

const ErrorSchema = z.object({
  message: z.string()
});

export class PostCars {
  @ApiRoute(
    'POST',
    '/cars/{id}',
    CarSchema,
    [
      { 
        statusCode: 201,
        description: "Car created successfully",
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
  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const cars = await this.getCars();
    return {
      statusCode: 200,
      body: JSON.stringify(cars),
    };
  }

  private async getCars() {
    return {
      cars: [
        { make: 'Toyota', model: 'Corolla' },
        { make: 'Honda', model: 'Civic' },
      ],
    };
  }
}

const instance = new PostCars();
export const handler = instance.handler.bind(instance);