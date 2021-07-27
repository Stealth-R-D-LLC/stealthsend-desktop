'use strict';

import { app, BrowserWindow, globalShortcut, ipcMain, Menu, protocol, shell, systemPreferences } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);
let win = {};
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1152,
    height: 700,
    minWidth: 1152,
    minHeight: 700,
    maxWidth: 1600,
    maxHeight: 1200,
    center: true,
    useContentSize: true,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      // nodeIntegration: true,
      // nodeIntegrationInWorker: true
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      // eslint-disable-next-line no-undef
      preload: __static + '/preload.js',
    },
  });

  // resize the window for the create process
  ipcMain.on('resize:create', () => {
    win.setBounds({
      width: 1152,
      height: 700,
      center: true,
      maximizable: false,
    });
    win.setResizable(false);
  });

  // resize window after create/recovery finishes
  ipcMain.on('resize:other', () => {
    // can accept event and args
    win.setBounds({
      width: 1152,
      height: 700,
      minWidth: 1152,
      minHeight: 700,
      maxWidth: 1600,
      maxHeight: 1200,
      center: true,
      maximizable: false,
    });
    win.setResizable(true);
  });

  // resize window when menu is always expanded
  ipcMain.on('resize:menu', () => {
    // can accept event and args
    win.setBounds({
      width: 1340,
      height: 700,
      minWidth: 1340,
      minHeight: 700,
      maxWidth: 1788,
      maxHeight: 1200,
      center: true,
      maximizable: false,
    });
    win.setResizable(true);
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
    {
      label: 'Edit',
      submenu: [
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  systemPreferences.askForMediaAccess('camera').then((isAllowed) => {
      console.log('isAllowed', isAllowed);
  });

  // webFrame.setZoomFactor(1);
  // webFrame.setVisualZoomLevelLimits(1, 1);

  win.setMenu(null); // remove menu bar

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadFile('index.html');
  }
  const webContents = win.webContents;
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
  });
  webContents.on('new-window', function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    var forceQuit = false;
    app.on('before-quit', function () {
      forceQuit = true;
    });
    win.on('close', function (event) {
      if (!forceQuit) {
        event.preventDefault();
      }
    });
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (process.platform === 'darwin') {
    globalShortcut.register('Command+Q', () => {
      app.quit();
    });
  }
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

app.on('will-quit', () => {
  if (process.platform === 'darwin') {
    globalShortcut.unregister('Command+Q');
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
