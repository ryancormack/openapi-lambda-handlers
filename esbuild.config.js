const config = {
  entryPoints: ['src/handlers/*.mts'],
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  outdir: 'dist',
  outExtension: { '.js': '.mjs' },
  entryNames: '[dir]/[name]/index',
  sourcemap: true,
  metafile: true,
  logLevel: 'info'
}

export default config