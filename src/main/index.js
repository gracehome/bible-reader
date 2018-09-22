import { app, ipcMain, BrowserWindow , remote, dialog, screen, Tray, Menu} from 'electron' // eslint-disable-line

const { download } = require('electron-dl');

const { Scripture, Verse } = require('../db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORE_PATH = app.getPath('userData');

const files = [
  { url: 'https://raw.githubusercontent.com/gracehome/bible-reader/master/data/md5.txt' },
  { url: 'https://raw.githubusercontent.com/gracehome/bible-reader/master/data/bible.sqlite' },
];
const bible_path = path.join(STORE_PATH, 'bible.sqlite');
const md5_path = path.join(STORE_PATH, 'md5.txt');

// 判断下载文件的完整性
async function compareHash() {
  if (!fs.existsSync(bible_path) || !fs.existsSync(md5_path)) {
    return Promise.resolve(false);
  }
  const md5sum = crypto.createHash('md5');
  const stream = fs.createReadStream(bible_path);
  const md5 = fs.readFileSync(md5_path, 'utf-8').trim();

  stream.on('data', (chunk) => {
    md5sum.update(chunk);
  });

  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      const hash = md5sum.digest('hex').toUpperCase();
      resolve(hash === md5);
    });
    stream.on('error', () => {
      reject(false);
    });
  });
}

async function updateBible() {
  [bible_path, md5_path].forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });

  return download(BrowserWindow.getFocusedWindow(), files[0].url, {
    saveAs: false,
    directory: STORE_PATH,
  }).then(() => download(BrowserWindow.getFocusedWindow(), files[1].url, {
    saveAs: false,
    directory: STORE_PATH,
  }));
}

async function needUpdate() {
  let needUpdated = false;

  [bible_path, md5_path].forEach((file) => {
    if (!fs.existsSync(file)) {
      needUpdated = true;
    }
  });
  const sameHash = await compareHash();
  if (!needUpdated && !sameHash) {
    needUpdated = true;
  }
  return needUpdated;
}

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

ipcMain.on('check-bible', async (event) => {
  const needUpdated = await needUpdate();
  return event.sender.send('check-bible-reply', needUpdated);
});

// 下载圣经
ipcMain.on('download-bible', async (event) => {
  await updateBible().then(async () => {
    const sameHash = await compareHash();
    event.sender.send('download-bible-reply', sameHash);
  });
});

// 获取圣经目录
ipcMain.on('get-sciptures', (event, version) => {
  Scripture.findAll({ where: { version }, raw: true }).then((s) => {
    event.sender.send('get-sciptures-reply', s);
  }).catch(() => {
    event.sender.send('get-sciptures-reply', []);
  });
});

ipcMain.on('chapter-read', (event, arg) => {
  Verse.findAll({ where: arg, raw: true }).then((verses) => {
    event.sender.send('chapter-read-reply', verses);
  }).catch(() => event.sender.send('chapter-read-reply', []));
});
