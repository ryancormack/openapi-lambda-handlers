import { z } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface PathParameter {
  name: string;
  schema: z.ZodType;
  description?: string;
}

export interface ResponseConfig {
  statusCode: number;
  description: string;
  schema: z.ZodType;
}

export interface RouteMetadata {
  path: string;
  method: HttpMethod;
  inputSchema?: z.ZodType;
  responses: ResponseConfig[];
  pathParameters?: PathParameter[];
  handlerName: string;
  functionName: string;
}