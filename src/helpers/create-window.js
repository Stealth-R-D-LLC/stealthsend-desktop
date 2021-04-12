const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

const isProd = app.isPackaged

let icon;
switch (process.platform) {
  case 'win32': icon = 'public/favicon.ico'; break;
  case 'darwin': icon = 'public/favicon.icns'; break;
  case 'linux': icon = 'public/favicon.png'; break;
}
 
module.exports = function createWindow(options = {}) {
  const winOptions = {
    minWidth: 1024,
    minHeight: 768,
    icon: icon,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    trafficLightPosition: {
      x: 20,
      y: 32,
    },
    ...options,
    webPreferences: {
      contextIsolation: true,
      devTools: !isProd,
      spellcheck: false,
      nodeIntegration: true,
      ...(options.webPreferences || {}),
    },
  }

  let windowState = windowStateKeeper({
    defaultWidth: winOptions.minWidth,
    defaultHeight: winOptions.minHeight,
  })

  let win

  win = new BrowserWindow({
    ...winOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  })
  windowState.manage(win)

  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })

  return win
}
