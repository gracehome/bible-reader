import { app, BrowserWindow } from 'electron' // eslint-disable-line

const fs = require('fs');
const path = require('path');

const STORE_PATH = app.getPath('userData');
const db = {};

if (!fs.existsSync(STORE_PATH)) { // 如果不存在路径
  fs.mkdirSync(STORE_PATH); // 就创建
}

const Sequelize = require('sequelize');
const sequelize = new Sequelize('bible', 'zunkun', '123456', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: path.join(STORE_PATH, 'bible.sqlite'),
});

const Version = sequelize.define('versions', {
  name_cn: { type: Sequelize.STRING },
  name_en: { type: Sequelize.STRING },
  abbr_cn: { type: Sequelize.STRING },
  abbr_en: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
  language_cn: { type: Sequelize.STRING },
  language_en: { type: Sequelize.STRING },
  author_cn: { type: Sequelize.STRING },
  author_en: { type: Sequelize.STRING },
  version: { type: Sequelize.STRING },
});

const Book = sequelize.define('books', {
  name_cn: { type: Sequelize.STRING },
  name_en: { type: Sequelize.STRING },
  abbr_cn: { type: Sequelize.STRING },
  abbr_en: { type: Sequelize.STRING },
  category: { type: Sequelize.INTEGER },
  category_name: { type: Sequelize.STRING },
  oldnew: { type: Sequelize.STRING },
  chapters: { type: Sequelize.INTEGER },
});

const Verse = sequelize.define('verses', {
  content: { type: Sequelize.STRING },
  book_cn: { type: Sequelize.STRING },
  book_en: { type: Sequelize.STRING },
  category: { type: Sequelize.INTEGER },
  category_name: { type: Sequelize.STRING },
  oldnew: { type: Sequelize.STRING },
  version: { type: Sequelize.INTEGER },
  chapter: { type: Sequelize.INTEGER },
  verse: { type: Sequelize.INTEGER },
});


Book.belongsTo(Version, {
  as: 'Version',
  foreignKey: {
    name: 'version',
    as: 'Version',
  },
  allowNull: false,
});

Verse.belongsTo(Book, {
  as: 'Book',
  foreignKey: {
    name: 'book',
    as: 'Book',
  },
  allowNull: false,
});

db.Version = Version;
db.Book = Book;
db.Verse = Verse;

export { Version, Book, Verse };

