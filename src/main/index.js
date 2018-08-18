import { app, ipcMain, BrowserWindow , remote, dialog, screen, Tray, Menu} from 'electron' // eslint-disable-line
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
let tray;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;


function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height,
    useContentSize: true,
    width,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
  return true;
});

if (isSecondInstance) {
  app.quit();
}


app.on('ready', () => {
  createWindow();
  tray = new Tray('build/icons/bible.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', type: 'normal', role: 'quit' },
  ]);
  tray.setToolTip('圣经阅读');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    const visible = mainWindow.isVisible();
    if (visible) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.on('show', () => {
    tray.setHighlightMode('always');
  });
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never');
  });
});

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

ipcMain.on('relaunch', () => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  app.exit(0);
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
    const STORE_PATH = app.getPath('userData');
    if (files) {
      const data = JSON.parse(fs.readFileSync(files[0]));
      if (!data || !data.verses) {
        event.sender.send('loaded-bible', false);
        return;
      }

      fs.createReadStream(files[0])
        .pipe(fs.createWriteStream(path.join(STORE_PATH, 'bible.json')))
        .on('finish', (err) => {
          if (err) {
            event.sender.send('loaded-bible', false);
            return;
          }
          event.sender.send('loaded-bible', true);
        });
      return;
    }
    event.sender.send('loaded-bible', false);
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
