const vue = require('@vitejs/plugin-vue')
const path = require('path')
const srcPath = path.resolve(__dirname, 'src')
import viteESLint from '@ehutch79/vite-eslint';
import voie from 'vite-plugin-voie';

module.exports = {
  server: {
    open: false, // do not open the browser as we use electron
    port: process.env.PORT || 3333,
  },
  alias: {
    // setup aliases for cleaner imports
    '/~': srcPath,
  },
  plugins: [vue(), voie(), viteESLint({ 'include': ['src/**/*.vue', 'src/**/*.js'] })],
  optimizeDeps: {
    // exclude path and electron-window-state as we are using the node runtime inside the browser
    // and don't wont vite to complain. If you have any issues importing node packages and vite complains,
    // add them here
    exclude: ['path', 'electron-window-state'],
  },
}
