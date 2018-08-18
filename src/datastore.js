const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

module.exports = (app, remote) => {
  const APP = process.type === 'renderer' ? remote.app : app;
  const STORE_PATH = APP.getPath('userData');

  if (process.type !== 'renderer') {
    if (!fs.existsSync(STORE_PATH)) { // 如果不存在路径
      fs.mkdirSync(STORE_PATH); // 就创建
    }
  }

  const adapter = new FileSync(path.join(STORE_PATH, 'bible.json'));
  const db = low(adapter);

  db.defaults({ book: {}, verses: [] }).write();
  return db;
};
