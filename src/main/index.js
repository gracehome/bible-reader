import { app, ipcMain, BrowserWindow , remote, dialog} from 'electron' // eslint-disable-line
const datastore = require('../datastore');
const db = datastore(app, remote);
const fs = require('fs');
const path = require('path');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('chapter-read', (event, data) => {
  const verses = db.get('verses').filter({
    abbr_en: data.abbr_en || 'Gen',
    chapter: data.chapter || 1,
  }).value();

  event.sender.send('chapter-read-reply', verses);
});

ipcMain.on('has-bible', (event) => {
  const hasBible = db.get('verses').filter({ id: 1 }).value().length === 1;
  event.sender.send('has-bible-reply', hasBible);
});


ipcMain.on('load-bible', (event) => {
  dialog.showOpenDialog({
    filters: [
      { name: 'JSON文件', extensions: ['json'] },
    ],
    properties: ['openFile'],
  }, (files) => {
    let loadedBible = true;
    const STORE_PATH = app.getPath('userData');
    if (files) {
      const data = JSON.parse(fs.readFileSync(files[0]));
      if (!data || !data.verses) {
        loadedBible = false;
      }
      if (loadedBible) {
        fs.createReadStream(files[0]).pipe(fs.createWriteStream(path.join(STORE_PATH, 'bible.json')));
      }
    }
    event.sender.send('loaded-bible', loadedBible);
  });
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
