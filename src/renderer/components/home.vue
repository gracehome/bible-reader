<template>
  <div id="home">
    <el-container class="container" v-loading="loading" element-loading-text="正在下载圣经数据">
      <el-aside width="200px" class="side">
        <el-row>
          <el-col :span="24" class="logo">
            <img src="@/assets/bible-logo.svg" alt="" style="height:40px;">
          </el-col>
        </el-row>
        <el-row>
          <p>你们当站在路上察看，访问古道，哪是善道，便行在其间；这样，你们心里必得安息。</p>
          <small class="right">—— 耶利米书6:16</small>
        </el-row>
      </el-aside>
      <el-main>
        <el-row>
          <el-alert title="今日经文" type="success" :closable="false" :description="scripture">
          </el-alert>
        </el-row>
        <el-row class="menu" :gutter="20" v-show="hasBible">
          <router-link :to="{name: 'bibleIndex', params: {version: 1}, query: {language: 'cn'}}">
            <el-col :span="6" class="menu-item bg-blue">
              <el-card shadow="hover">
                和合本圣经
              </el-card>
            </el-col>
          </router-link>
          <router-link :to="{name: 'bibleIndex', params: {version: 2}, query: {language: 'en'}}">
            <el-col :span="6" class="menu-item bg-blue">
              <el-card shadow="hover">
                钦定本KJV
              </el-card>
            </el-col>
          </router-link>
        </el-row>
        <el-row :gutter="20">
          <router-link  v-for="(book, index) in books" :key="'book-' + index" :to="{name: 'book', params: {id: book.id}}">
            <el-col :span="6" class="menu-item">
              <el-card shadow="hover">
                {{book.name}}
              </el-card>
            </el-col>
          </router-link>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data() {
      return {
        scripture: '不从恶人的计谋、不站罪人的道路、不坐亵慢人的座位、惟喜爱耶和华的律法、昼夜思想、这人便为有福。 --诗篇1:1-2',
        loading: true,
        hasBible: true,
        books: [],
      };
    },
    created() {
      this.$electron.ipcRenderer.send('check-bible');
      this.$electron.ipcRenderer.send('get-books');

      this.$electron.ipcRenderer.on('check-bible-reply', (event, needUpdated) => {
        if (needUpdated) {
          this.hasBible = false;
          this.loading = true;
          if (!navigator.onLine) {
            setTimeout(() => {
              this.loading = false;
              this.notify('当前未联网', '请检查您的网络');
            }, 3000);
            return;
          }

          this.$electron.ipcRenderer.send('download-bible');
          return;
        }
        this.loading = false;
      });

      this.$electron.ipcRenderer.on('download-bible-reply', (event, downloaded) => {
        this.loading = false;
        if (!downloaded) {
          this.hasBible = false;
          this.notify('下载数据失败', '下载出现错误, ');
          return;
        }
        this.hasBible = true;
        this.notify('下载数据成功', '请浏览您的圣经');
      });

      this.$electron.ipcRenderer.on('get-books-reply', (event, books) => {
        this.books = books || [];
      });
    },
    methods: {
      notify(title, message) {
        const h = this.$createElement;
        this.$notify({
          title,
          message: h('i', {
            style: 'color: teal',
          }, message),
        });
      },
    },
  };
</script>

<style>
  .side {
    border-right: solid gainsboro;
    background-color: #fafafa;
    padding: 5px;
  }

  .logo {
    text-align: center;
    border-bottom: solid gainsboro;
  }

  .container {
    height: 100vh;
  }

  .right {
    float: right;
  }

  .menu {
    margin-top: 2rem;
  }

  .menu-item {
    text-align: center;
    font-size: 1.2rem;
    padding-top: 10px;
  }
</style>