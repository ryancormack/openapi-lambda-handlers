import * as esbuild from 'esbuild'
import config from './esbuild.config.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

async function zipFunction(functionName) {
  const sourceDir = path.join('dist', functionName)
  const zipFile = path.join('dist', `${functionName}.zip`)
  
  // Ensure we're in the function directory when zipping
  await execAsync(`cd ${sourceDir} && zip -r ../${functionName}.zip ./*`)
  console.log(`Created ${zipFile}`)
}

async function build() {
  try {
    // Clean dist
    await execAsync('rm -rf dist')
    
    // Build with esbuild
    await esbuild.build(config)
    
    // Get all function directories
    const functionDirs = fs.readdirSync('dist')
      .filter(f => fs.statSync(path.join('dist', f)).isDirectory())
    
    // Zip each function
    for (const functionName of functionDirs) {
      await zipFunction(functionName)
    }
    
    console.log('Build completed successfully')
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}

build()