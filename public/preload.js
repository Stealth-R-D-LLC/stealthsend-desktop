const { ipcRenderer, contextBridge } = require('electron');
contextBridge.exposeInMainWorld('ipc', {
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
});
window.ipcRenderer = ipcRenderer;
