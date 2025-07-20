
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db'); // 👈 This is your custom DB module

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon/favicon.ico')
  });
  // win.loadFile(path.join(__dirname, '../www/index.html')); // IMPORTANT
  win.loadURL('http://localhost:8100');
}

app.whenReady().then(createWindow);

// 🔌 IPC handlers
ipcMain.handle('db:insertVoter', (event, data) => db.insertVoter(data));
ipcMain.handle('db:getVoters', () => db.getVoters());
ipcMain.handle('db:getVoterById', async (event, id) => {
  return await db.getVoterById(id);
});
ipcMain.handle('db:updateVoter', async (event, id, voterData) => {
  return await db.updateVoter(id, voterData);
});
