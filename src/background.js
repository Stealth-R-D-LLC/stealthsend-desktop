'use strict';

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  protocol,
  shell,
  session,
  systemPreferences,
} from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';
const os = require('os');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let delta = {
  linux: {
    height: 26,
    width: 0,
  },
  mac: {
    height: 0,
    width: 0,
  },
  windows: {
    height: 20,
    width: 0,
  },
  other: {
    height: 0,
    width: 0,
    maxHeight: 0,
  },
};

function getOs() {
  const currentOs = os.type().toLowerCase();
  if (currentOs.includes('linux')) {
    return 'linux';
  } else if (currentOs.includes('darwin')) {
    return 'mac';
  } else if (currentOs.includes('windows')) {
    return 'windows';
  }
  return 'other';
}

let win = {};
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1152,
    height: 700 - delta[getOs()].height,
    minWidth: 1152,
    minHeight: 700 - delta[getOs()].height,
    maxWidth: 1600,
    maxHeight: 1200 - delta[getOs()].height,
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
      height: 700 - delta[getOs()].height,
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
      height: 700 - delta[getOs()].height,
      minWidth: 1152,
      minHeight: 700 - delta[getOs()].height,
      maxWidth: 1600,
      maxHeight: 1200 - delta[getOs()].height,
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
      height: 700 - delta[getOs()].height,
      minWidth: 1340,
      minHeight: 700 - delta[getOs()].height,
      maxWidth: 1788,
      maxHeight: 1200 - delta[getOs()].height,
      center: true,
      maximizable: false,
    });
    win.setResizable(true);
  });

  const menuTemplate = [
    {
      label: 'StealthSend',
      submenu: [
        {
          label: 'Quit StealthSend',
          accelerator: 'CmdOrCtrl+Q',
          role: 'close',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  /* systemPreferences.askForMediaAccess('camera').then((isAllowed) => {
    console.log('isAllowed', isAllowed);
  }); */

  // webFrame.setZoomFactor(1);
  // webFrame.setVisualZoomLevelLimits(1, 1);

  // win.setMenu(null); // remove menu bar

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
    console.log('-----------------1', url);

    event.preventDefault();
    if (url.includes('https://stealthmonitor.org/')) {
      shell.openExternal(url);
    }
  });
  webContents.on('will-navigate', (event, url) => {
    console.log('----------------2-', url);
    event.preventDefault();
    if (url.includes('https://stealthmonitor.org/')) {
      shell.openExternal(url);
    }
  });
}
async function askForMediaAccess() {
  try {
    if (process.platform !== 'darwin') {
      return true;
    }

    const status = await systemPreferences.getMediaAccessStatus('camera');
    console.info('Current camera access status:', status);

    if (status === 'not-determined') {
      const success = await systemPreferences.askForMediaAccess('camera');
      console.info(
        'Result of camera access:',
        success.valueOf() ? 'granted' : 'denied'
      );
      return success.valueOf();
    }

    return status === 'granted';
  } catch (error) {
    console.error('Could not get camera permission:', error.message);
  }
  return false;
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

  session
    .fromPartition('some-partition')
    .setPermissionRequestHandler((webContents, permission, callback) => {
      const url = webContents.getURL();

      // https://www.electronjs.org/docs/api/session#sessetpermissionrequesthandlerhandler
      const allowed = ['clipboard-read', 'media', 'openExternal'];
      if (allowed.includes(permission)) {
        // Approves the permissions request
        callback(true);
      }

      const notAllowed = [
        'display-capture',
        'mediaKeySystem',
        'geolocation',
        'notifications',
        'midi',
        'midiSysex',
        'pointerLock',
        'fullscreen',
        'unknown',
      ];
      if (notAllowed.includes(permission)) {
        // Denies the permissions request
        callback(false);
      }

      // // Verify URL
      if (!url.startsWith('https://stealthmonitor.org/')) {
        // Denies the permissions request
        return callback(false);
      }
    });

  createWindow();
  askForMediaAccess();
});

app.on('will-quit', () => {
  if (process.platform === 'darwin') {
    globalShortcut.unregister('Command+Q');
  }
});

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
