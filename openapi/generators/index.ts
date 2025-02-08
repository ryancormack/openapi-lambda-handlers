import { RouteMetadata } from '../types/metadata.js';
import { zodToOpenAPI } from '../utils/zod-to-openapi.js';

function extractPathParameters(path: string): string[] {
  const matches = path.match(/{([^}]+)}/g);
  return matches ? matches.map(m => m.replace(/{|}/g, '')) : [];
}

export function generateOpenAPISpec(routes: RouteMetadata[]): any {
  const paths: Record<string, any> = {};
  const schemas: Record<string, any> = {};
  
  for (const route of routes) {
    if (!paths[route.path]) {
      paths[route.path] = {};
    }

    const responses: Record<string, any> = {};
    route.responses.forEach(response => {
      responses[response.statusCode] = {
        description: response.description,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${route.functionName}${response.statusCode}` }
          }
        }
      };
      schemas[`${route.functionName}${response.statusCode}`] = zodToOpenAPI(response.schema);
    });

    // Extract path parameters
    const pathParams = extractPathParameters(route.path).map(param => ({
      in: 'path',
      name: param,
      required: true,
      schema: {
        type: 'string'
      }
    }));

    paths[route.path][route.method.toLowerCase()] = {
      parameters: pathParams,
      ...(route.inputSchema && {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${route.functionName}Input` }
            }
          }
        }
      }),
      responses,
      'x-amazon-apigateway-integration': {
        uri: `arn:aws:apigateway:\${region}:lambda:path/2015-03-31/functions/arn:aws:lambda:\${region}:\${account_id}:function:${route.functionName}/invocations`,
        responses: {
          default: { statusCode: "200" }
        },
        passthroughBehavior: "when_no_match",
        httpMethod: "POST",
        contentHandling: "CONVERT_TO_TEXT",
        type: "aws_proxy"
      }
    };
    
    if (route.inputSchema) {
      schemas[`${route.functionName}Input`] = zodToOpenAPI(route.inputSchema);
    }
  }
  
  return {
    openapi: '3.0.0',
    info: {
      title: 'cars-api',
      version: 'v1.0'
    },
    paths,
    components: {
      schemas
    }
  };
}