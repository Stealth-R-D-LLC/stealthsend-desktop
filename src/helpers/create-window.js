const { app, BrowserWindow, webFrame, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');

const isProd = app.isPackaged;

let icon;
switch (process.platform) {
  case 'win32':
    icon = 'public/favicon.ico';
    break;
  case 'darwin':
    icon = 'public/favicon.icns';
    break;
  case 'linux':
    icon = 'public/favicon.png';
    break;
}

module.exports = function createWindow(options = {}) {
  const winOptions = {
    width: 1152,
    height: 700,
    minWidth: 1152,
    minHeight: 700,
    maxWidth: 1600,
    maxHeight: 1200,
    center: true,
    maximizable: false,
    fullscreenable: false,
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
  };

  let windowState = windowStateKeeper({
    defaultWidth: winOptions.minWidth,
    defaultHeight: winOptions.minHeight,
  });

  let win;

  win = new BrowserWindow({
    ...winOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  });
  windowState.manage(win);

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  const menuTemplate = [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'close' }],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  webFrame.setZoomFactor(1);
  webFrame.setVisualZoomLevelLimits(1, 1);
  return win;
};
