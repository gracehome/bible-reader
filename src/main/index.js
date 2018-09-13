import { app, ipcMain, BrowserWindow , remote, dialog, screen, Tray, Menu} from 'electron' // eslint-disable-line

const { download } = require('electron-dl');

const { Book, Verse } = require('../db');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const crypto = require('crypto');

const STORE_PATH = app.getPath('userData');

const bible_url = 'https://raw.githubusercontent.com/gracehome/bible-reader/master/data/bible.sqlite';

// 判断下载文件的完整性
function compareHash(cb) {
  let hash;
  const md5sum = crypto.createHash('md5');
  const stream = fs.createReadStream(path.join(STORE_PATH, 'bible.sqlite'));
  stream.on('data', (chunk) => {
    md5sum.update(chunk);
  });
  stream.on('end', () => {
    hash = md5sum.digest('hex').toUpperCase();
    cb(hash === config.hash);
  });

  stream.on('error', () => {
    cb(false);
  });
}

function downloadBible() {
  if (!fs.existsSync(path.join(STORE_PATH, 'bible.sqlite'))) {
    return download(BrowserWindow.getFocusedWindow(), bible_url, {
      directory: STORE_PATH,
      filename: 'bible.sqlite',
    });
  }
  return Promise.resolve(true);
}

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

// 创建仪表盘
function createTray() {
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
}

// 存在一个实例处理
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
  createTray();
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

// 重启
ipcMain.on('relaunch', () => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  app.exit(0);
});

// 检查是否有数据文件，以及验证数据文件完整性
ipcMain.on('check-bible', (event) => {
  const exists = fs.existsSync(path.join(STORE_PATH, 'bible.sqlite'));
  if (exists) {
    compareHash((completed) => {
      if (!completed) {
        fs.unlinkSync(path.join(STORE_PATH, 'bible.sqlite'));
        event.sender.send('check-bible-reply', false);
        return;
      }
      event.sender.send('check-bible-reply', true);
    });
    return;
  }
  event.sender.send('check-bible-reply', false);
});

// 下载圣经
ipcMain.on('download-bible', (event) => {
  downloadBible().then(() => {
    compareHash((completed) => {
      if (!completed) {
        fs.unlinkSync(path.join(STORE_PATH, 'bible.sqlite'));
      }
      event.sender.send('download-bible-reply', completed);
    });
  }).catch(() => {
    event.sender.send('download-bible-reply', false);
  });
});

// 获取圣经目录
ipcMain.on('get-books', (event, version) => {
  Book.findAll({ where: { version }, raw: true }).then((books) => {
    event.sender.send('get-books-reply', books);
  }).catch(() => {
    event.sender.send('get-books-reply', []);
  });
});

ipcMain.on('chapter-read', (event, arg) => {
  Verse.findAll({ where: arg, raw: true }).then((verses) => {
    event.sender.send('chapter-read-reply', verses);
  }).catch(() => event.sender.send('chapter-read-reply', []));
});
