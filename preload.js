const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    openPath: shell.openPath
  }
);