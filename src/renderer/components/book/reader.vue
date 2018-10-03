<template>
  <div id="book">
    <el-container class="container">
      <el-aside width="200px" class="side">
        <router-link :to="{name: 'home'}">
          <el-row style="text-align:center;">
            <h3>{{book.name}}</h3>
          </el-row>
        </router-link>
        <el-row>
          <el-col :span="24">
            <el-menu class="el-menu-vertical-demo">
              <el-menu-item v-for="(chapter, index) in chapters" :key="'chapter-' + index" :index="'chapter-' + index"
                @click="getPaper(chapter.id)">
                <i class="el-icon-document"></i>
                <span slot="title">{{chapter.title}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{book.name}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{currentChapter.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-show="paper.content">
          <div id="content" v-html="paper.content"></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'book',
    data() {
      return {
        book: {},
        chapters: [],
        currentChapter: {},
        paper: {},
      };
    },
    created() {
      this.$electron.ipcRenderer.send('get-chapters', this.$route.params.id);
      this.$electron.ipcRenderer.on('get-chapters-reply', (event, items) => {
        this.chapters = items;
        this.currentChapter = this.chapters[0] || {};
        if (this.currentChapter.id) {
          this.getPaper(this.currentChapter.id);
        }
      });

      this.$electron.ipcRenderer.send('get-book', this.$route.params.id);
      this.$electron.ipcRenderer.on('get-book-reply', (event, book) => {
        this.book = book;
      });

      this.$electron.ipcRenderer.on('get-paper-reply', (event, paper) => {
        if (!paper) { paper = { content: '' }; }
        if (!paper.content) { paper.content = ''; }
        this.paper = paper;
      });
    },
    methods: {
      getPaper(chapter) {
        this.$electron.ipcRenderer.send('get-paper', {
          book: this.$route.params.id,
          chapter,
        });
      },
    },
  };
</script>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }

  #content a {
    pointer-events: none;
  }

  .side {
    border-right: solid gainsboro;
    background-color: #fafafa;
    padding-left: 5px;
    overflow-x: hidden;
  }

  .container {
    height: 100vh;
  }
</style>