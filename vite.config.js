const vue = require('@vitejs/plugin-vue')
const path = require('path')
import viteESLint from '@ehutch79/vite-eslint'
const srcPath = path.resolve(__dirname, 'src')

module.exports = {
  server: {
    open: false, // do not open the browser as we use electron
    port: process.env.PORT || 3333,
  },
  alias: {
    // setup aliases for cleaner imports
    '/~': srcPath,
  },
  plugins: [vue(), viteESLint({ 'include': ['src/**/*.vue', 'src/**/*.js'] })],
  optimizeDeps: {
    // exclude path and electron-window-state as we are using the node runtime inside the browser
    // and don't wont vite to complain. If you have any issues importing node packages and vite complains,
    // add them here
    exclude: ['path', 'electron-window-state'],
  },
}
