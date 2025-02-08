import { z } from 'zod';

export function zodToOpenAPI(schema: z.ZodType): any {
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, any> = {};
    for (const [key, value] of Object.entries(schema.shape)) {
      properties[key] = zodToOpenAPI(value as z.ZodType);
    }
    return {
      type: 'object',
      properties
    };
  }
  
  if (schema instanceof z.ZodString) {
    return { type: 'string' };
  }
  
  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodToOpenAPI(schema.element)
    };
  }
  
  return { type: 'string' };
}