const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  insertVoter: (data) => ipcRenderer.invoke('db:insertVoter', data),
  getVoters: () => ipcRenderer.invoke('db:getVoters'),
  getVoterById: (id) => ipcRenderer.invoke('db:getVoterById', id),
  updateVoter: (id, data) => ipcRenderer.invoke('db:updateVoter', id, data),
  insertMasterData: (data) => ipcRenderer.invoke('db:insertMasterData', data),
  getDistricts: () => ipcRenderer.invoke('db:getDistricts'),
  getVidhanSabhas: (district_id) => ipcRenderer.invoke('db:getVidhanSabhas', district_id),
  getWards: (vs_id) => ipcRenderer.invoke('db:getWards', vs_id),
  getMohallas: (ward_id) => ipcRenderer.invoke('db:getMohallas', ward_id),
  getNameById: (table, id) => ipcRenderer.invoke('db:getNameById', table, id)
});
