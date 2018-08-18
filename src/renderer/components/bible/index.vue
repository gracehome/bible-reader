<template>
  <div class="bible-index">
    <div v-if="!hasBible">
      <el-alert
        title="没有圣经数据"
        type="error"
        description="请导入圣经数据文件 bible.json">
      </el-alert>
      <el-button type="success" style="margin-top: 10px;" size="small" :closable="false" plain @click="loadBible()">导入圣经数据文件</el-button>
    </div>
    <div v-else>
      <p>旧约</p>
      <el-row :gutter="10">
        <el-col :span="4" v-for="(book, index) in oldBooks" :key="'old-' + index" class="book-item">
          <router-link :to="{name: 'reader', params: {abbr_en: book.abbr_en}}">
            <el-card shadow="hover" class="book-body">
              <small class="name">{{book.name_cn}}</small>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-row>
        <h4>新约</h4>
        <el-col :span="4" v-for="(book, index) in newBooks" :key="'new-' + index" class="book-item">
          <router-link :to="{name: 'reader', params: {abbr_en: book.abbr_en}, query: {chapter: 1}}">
            <el-card shadow="hover" class="book-body">
              <small class="name">{{book.name_cn}}</small>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bibleIndex',
    data() {
      return {
        oldBooks: [],
        newBooks: [],
        hasBible: true,
      };
    },
    created() {
      this.$electron.ipcRenderer.send('has-bible');
      this.$electron.ipcRenderer.on('has-bible-reply', (event, hasBible) => {
        this.hasBible = hasBible || false;
      });

      this.$electron.ipcRenderer.on('loaded-bible', (event, loaded) => {
        const h = this.$createElement;
        if (loaded) {
          this.hasBible = true;

          this.$notify({
            title: '导入成功',
            message: h('i', { style: 'color: teal' }, '导入成功，重启本应用'),
          });

          this.$electron.ipcRenderer.send('relaunch');
          return;
        }
        this.$notify({
          title: '导入失败',
          message: h('i', { style: 'color: red' }, '导入失败，请重新导入'),
        });
      });

      this.oldBooks = this.$store.getters.category('old');
      this.newBooks = this.$store.getters.category('new');
    },
    methods: {
      loadBible() {
        this.$electron.ipcRenderer.send('load-bible');
      },
    },
  };
</script>

<style>
  .abbr {
    text-align: center;
  }

  .book-item {
    padding-top: 5px;
    text-align: center;
  }

  .book-body {
    cursor: pointer;
  }

  .book-body:hover {
    border: solid green 1px;
  }
</style>