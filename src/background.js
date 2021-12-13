'use strict';

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  protocol,
  session,
  shell,
  systemPreferences,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import pkgjson from '@/../package.json';
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
      backgroundThrottling: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      webSecurity: true, // do not set this to false
      allowRunningInsecureContent: false, // do not set this to true
      disableBlinkFeatures: 'Auxclick', // https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
      sandbox: true, // https://github.com/doyensec/electronegativity/wiki/SANDBOX_JS_CHECK
      // eslint-disable-next-line no-undef
      preload: __static + '/preload.js',
    },
  });

  const allowedUrls = [
    'https://www.allaboutcookies.org/',
    'https://www.google.ch/policies/privacy/partners',
    'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2016.119.01.0001.01.ENG',
    'https://www.admin.ch/opc/en/classified-compilation/19920153/index.html',
    'https://www.admin.ch/opc/en/classified-compilation/19930159/index.html',
    'https://github.com/Stealth-R-D-LLC/Stealth',
    'https://coincap.io/',
    'https://stealth.org/',
  ];

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

  const isMac = process.platform === 'darwin';

  const menuTemplate = [
    ...(isMac
      ? [
          {
            label: 'StealthSend',
            submenu: [
              {
                label: 'About StealthSend',
                role: 'about',
              },
              {
                label: 'Hide StealthSend',
                role: 'hide',
              },
              {
                role: 'hideOthers',
              },
              {
                role: 'unhide',
              },
              {
                label: 'Quit StealthSend',
                accelerator: 'CmdOrCtrl+Q',
                role: 'close',
              },
            ],
          },
        ]
      : [
          {
            label: 'StealthSend',
            submenu: [
              {
                label: 'About StealthSend',
                role: 'about',
              },
              {
                role: 'unhide',
              },
              {
                label: 'Quit StealthSend',
                accelerator: 'CmdOrCtrl+Q',
                role: 'close',
              },
            ],
          },
        ]),
    {
      label: 'Edit',
      submenu: [
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:',
        },
      ],
    },
    // {
    //   label: 'View',
    //   submenu: [{ role: 'toggleDevTools' }],
    // },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  const options = {
    applicationName: 'StealthSend',
    applicationVersion: `Stealth: The Fastest Private Digital Currency \n\n  We are building the Holy Grail of Crypto: a fast, feeless, private and scalable digital currency \n\n Github Source Repository \n https://github.com/Stealth-R-D-LLC/Stealth \n\n Application version: v${pkgjson.version}`,
    copyright:
      'This application is provided to you for free under the GNU General Public Licence by Stealth R&D LLC',
    authors: [pkgjson.authors],
  };
  app.setAboutPanelOptions(options);
  app.setAccessibilitySupportEnabled(false);

  // webFrame.setZoomFactor(1);
  // webFrame.setVisualZoomLevelLimits(1, 1);

  // win.setMenu(null); // remove menu bar

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
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
  webContents.setWindowOpenHandler((details) => {
    // new-window has been replaced with this
    const url = details.url;
    if (
      allowedUrls.includes(url) ||
      url.includes('https://stealthmonitor.org/')
    ) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('mailto:')) {
      shell.openExternal(url);
    }
    if (
      allowedUrls.includes(url) ||
      url.includes('https://stealthmonitor.org/')
    ) {
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

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    if (!params.src.startsWith('https://stealthmonitor.org/')) {
      event.preventDefault();
    }
  });
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
  if (process.env.IS_TEST) askForMediaAccess();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const contentSecurityPolicyHeaders = {
      'content-security-policy': [
        "style-src 'unsafe-inline' 'self' https://fonts.googleapis.com app:;",
        "style-src-elem 'unsafe-inline' https://fonts.googleapis.com 'self' https://fonts.googleapis.com app:;",
        "font-src https://fonts.gstatic.com 'self';",
        // "default-src 'self' https://api-mainnet.stealthmonitor.xyz https://api.stealth.org 172.20.10.112:8080 app:;",
        "connect-src 'self' https://api-mainnet.stealthmonitor.xyz https://api.stealth.org 172.20.10.169:8080 app:;",
        "script-src 'unsafe-inline' 'unsafe-eval' 'self' app: blob:;",
        "script-src-elem 'unsafe-inline' 'self' app:;",
        "img-src 'self' app: data:;",
        "object-src 'none';",
        "manifest-src 'none';",
      ],
      ...details.responseHeaders,
    };

    callback({
      responseHeaders: contentSecurityPolicyHeaders,
    });
  });
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
