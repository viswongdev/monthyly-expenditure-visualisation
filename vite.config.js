import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    base: '/monthyly-expenditure-visualisation/',
    plugins: [
        viteStaticCopy({
          targets: [
            {
                src: 'assets/*',
                dest: 'assets',
            }
          ]
        })
      ]
});