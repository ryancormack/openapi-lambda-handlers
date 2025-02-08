import { generateOpenAPISpec } from './openapi/generators/index.js';
import { getRouteRegistry } from './openapi/decorators/ApiRoute.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamic handler imports
const handlersDir = join(__dirname, 'src', 'handlers');
const handlerFiles = fs.readdirSync(handlersDir);

// Import all handler files
for (const file of handlerFiles) {
  if (file.endsWith('.mts')) {
    const modulePath = pathToFileURL(join(handlersDir, file)).href;
    await import(modulePath);
  }
}

const spec = generateOpenAPISpec(getRouteRegistry());
fs.writeFileSync('openapi.json', JSON.stringify(spec, null, 2));
fs.writeFileSync('openapi.json.tftpl', JSON.stringify(spec, null, 2));