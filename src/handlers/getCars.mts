import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { ApiRoute } from "../../openapi/decorators/ApiRoute.js";

console.log('Hello from getCars.mts');

//write this file in the same way that the PostCars works
const CarSchema = z.object({
    make: z.string(),
    model: z.string(),
});

const ErrorSchema = z.object({
    message: z.string()
  });

export class GetCars {
    @ApiRoute(
        'GET',
        '/cars/{id}',
        undefined,
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

const instance = new GetCars();
export const handler = instance.handler.bind(instance);