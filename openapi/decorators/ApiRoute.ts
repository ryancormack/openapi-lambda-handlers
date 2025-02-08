import { z } from 'zod';
import { HttpMethod, RouteMetadata, ResponseConfig } from '../types/metadata.js';

const routeRegistry: RouteMetadata[] = [];

export function ApiRoute(
  method: HttpMethod,
  path: string,
  inputSchema: z.ZodType | undefined,
  responses: ResponseConfig[]
) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const functionName = target.constructor.name.toLowerCase();
    
    routeRegistry.push({
      path,
      method,
      inputSchema,
      responses,
      handlerName: propertyKey,
      functionName
    });
    
    return descriptor;
  };
}

export function getRouteRegistry(): RouteMetadata[] {
  return routeRegistry;
}