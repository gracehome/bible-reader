import { app, BrowserWindow } from 'electron' // eslint-disable-line

const fs = require('fs');
const path = require('path');

const STORE_PATH = app.getPath('userData');

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

const Scripture = sequelize.define('scriptures', {
  name_cn: { type: Sequelize.STRING },
  name_en: { type: Sequelize.STRING },
  abbr_cn: { type: Sequelize.STRING },
  abbr_en: { type: Sequelize.STRING },
  category: { type: Sequelize.INTEGER },
  category_name: { type: Sequelize.STRING },
  oldnew: { type: Sequelize.STRING },
  chapters: { type: Sequelize.INTEGER },
  order: { type: Sequelize.INTEGER },
});

const Verse = sequelize.define('verses', {
  content: { type: Sequelize.STRING },
  scripture_cn: { type: Sequelize.STRING },
  scripture_en: { type: Sequelize.STRING },
  category: { type: Sequelize.INTEGER },
  category_name: { type: Sequelize.STRING },
  oldnew: { type: Sequelize.STRING },
  version: { type: Sequelize.INTEGER },
  chapter: { type: Sequelize.INTEGER },
  verse: { type: Sequelize.INTEGER },
});


const Book = sequelize.define('books', {
  name: { type: Sequelize.STRING },
  sub_name: { type: Sequelize.STRING },
  author: { type: Sequelize.STRING },
  publish_date: { type: Sequelize.DATE },
  publisher: { type: Sequelize.STRING },
  resource: { type: Sequelize.STRING },
  resource_url: { type: Sequelize.TEXT },
  picture: { type: Sequelize.TEXT },
  description: { type: Sequelize.TEXT },
});

const Chapter = sequelize.define('chapters', {
  title: { type: Sequelize.STRING },
  sub_title: { type: Sequelize.STRING },
  order: { type: Sequelize.INTEGER },
  description: { type: Sequelize.TEXT },
});

const Paper = sequelize.define('papers', {
  state: { type: Sequelize.INTEGER, defaultValue: 10 }, // 10-publish 20-draft
  content: { type: Sequelize.TEXT },
});

Scripture.belongsTo(Version, {
  as: 'Version',
  foreignKey: {
    name: 'version',
    as: 'Version',
  },
  allowNull: false,
});

Verse.belongsTo(Scripture, {
  as: 'Scripture',
  foreignKey: {
    name: 'scripture',
    as: 'Scripture',
  },
  allowNull: false,
});

Chapter.belongsTo(Book, {
  as: 'Chapter',
  foreignKey: {
    name: 'book',
    as: 'Book',
  },
  allowNull: false,
});

Paper.belongsTo(Book, {
  as: 'PaperBook',
  foreignKey: {
    name: 'book',
    as: 'Book',
  },
  allowNull: false,
});

Paper.belongsTo(Chapter, {
  as: 'PaperChapter',
  foreignKey: {
    name: 'chapter',
    as: 'Chapter',
  },
  allowNull: false,
});

export { Version, Scripture, Verse, Book, Chapter, Paper };

