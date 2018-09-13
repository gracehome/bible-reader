# bible

> 圣经阅读器

![圣经阅读器](./public/bible-1.png)
![圣经阅读器](./public/bible-2.png)
![圣经阅读器](./public/bible-3.png)


#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

### 数据库问题
使用了`sqlite`作为数据库存储，遇到初始化数据的坑, 故采用联网下载数据文件

`data` 文件包含 `bible.sqlite`文件，同时上传 `md5.txt` 作为校验，本程序需要将 md5 的 hash 值写入 `src/config` 中，比较麻烦，你可以自己修改为其他方式。


### sqlite 包的问题
```
1. npm install electron-rebuild
2. ./node_modules/.bin/electron-rebuild -f -w sqlite
```
注意： 请使用 npm 安装 sqlite , 使用 cnpm 报错，如何解决还没有查考
