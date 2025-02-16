import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/main.album.js', 'src/main.collection.js'],
  bundle: true,
  outdir: 'dist',
})
