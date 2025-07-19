const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  insertVoter: (data) => ipcRenderer.invoke('db:insertVoter', data),
  getVoters: () => ipcRenderer.invoke('db:getVoters'),
  getVoterById: (id) => ipcRenderer.invoke('db:getVoterById', id),
  updateVoter: (id, data) => ipcRenderer.invoke('db:updateVoter', id, data)
});
