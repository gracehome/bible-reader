const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = (app, remote) => {
  const APP = process.type === 'renderer' ? remote.app : app;
  const STORE_PATH = APP.getPath('userData');

  const adapter = new FileSync(path.join(STORE_PATH, 'bible.json'));
  const db = low(adapter);

  db.defaults({ book: {}, verses: [] }).write();
  return db;
};
