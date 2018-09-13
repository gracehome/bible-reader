<template>
  <div class="bible-reader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'bible' }">目录</el-breadcrumb-item>
      <el-breadcrumb-item>{{book.name_cn}}</el-breadcrumb-item>
      <el-breadcrumb-item>第{{chapter}}章</el-breadcrumb-item>
    </el-breadcrumb>
    <p>{{book.name_cn}}</p>
    <el-row :gutter="6">
      <el-col :span="2" v-for="n in book.chapters" :key="book.abbr_en + '-' + n"><div class="grid-content ch-item"  @click="showVerses({version: version, book: bookId, chapter: n})"  :class="{active: isActive(n,chapter)}">{{n}}</div></el-col>
    </el-row>
    <el-row>
      <p v-for="(verse,index) in verses" :key="'verse-' + index">{{verse.verse}}  {{verse.content}}</p>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'bibleReader',
    data() {
      return {
        book: {
          name_cn: '',
          abbr_en: '',
          chapters: 0,
        },
        version: 1,
        bookId: 1,
        chapter: 1,
        abbr_en: 'Gen',
        verses: [],
      };
    },
    created() {
      this.chapter = this.$route.query.chapter || 1;
      this.abbr_en = this.$route.params.abbr_en || 'Gen';
      this.version = this.$route.params.version || 1;
      this.bookId = this.$route.params.book || 1;
      this.chapter = this.$route.params.chapter || 1;

      this.book = this.$store.getters.book({
        version: this.version,
        book: this.bookId,
      });

      this.getVerses({
        version: this.version,
        book: this.bookId,
        chapter: this.chapter,
      });

      this.$electron.ipcRenderer.on('chapter-read-reply', (event, data) => {
        this.verses = data || [];
      });
    },
    methods: {
      getVerses(arg) {
        this.$electron.ipcRenderer.send('chapter-read', arg);
      },
      showVerses(arg) {
        this.$router.push({ name: 'reader', params: arg });
        this.getVerses(arg);
      },
      isActive(chapter) {
        this.chapter = this.$route.params.chapter || 1;
        return this.chapter === chapter;
      },
    },
    destroyed() {
      this.$electron.ipcRenderer.removeAllListeners('chapter-read-reply');
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath !== from.fullPath) {
        this.getVerses(to.params);
      }
      if (to.params.book !== from.params.book) {
        this.book = this.$store.getters.book({
          version: to.params.version,
          book: to.params.book,
        });
      }
      next();
    },
  };
</script>

<style>
.ch-item {
  border: solid #99CCCC 1px;
  margin: 3px;
  padding: 3px;
  text-align: center;
  cursor: pointer;
}

.ch-item:hover {
  border-color: red;
}

.grid-content.active {
  background: #67C23A;
}
</style>