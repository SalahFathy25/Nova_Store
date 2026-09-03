import { build } from 'esbuild';

await build({
  entryPoints: ['api/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/index.js',
  format: 'cjs',
  external: ['pg', 'pg-native', 'bcryptjs', 'better-sqlite3'],
  define: {
    'import.meta.url': 'import_meta_url',
    'process.env.NODE_ENV': '"production"',
  },
  alias: {
    'import.meta.url': 'import_meta_url',
  },
  banner: {
    js: `const import_meta_url = typeof document === 'undefined' ? require('url').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('api/index.js', document.baseURI).href);`,
  },
  minify: false,
  sourcemap: false,
});

console.log('Build completed!');
