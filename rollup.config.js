import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    commonjs(),
    json(),
    nodeResolve(),
    typescript({
      tsconfig: 'tsconfig.prod.json'
    })
  ]
}