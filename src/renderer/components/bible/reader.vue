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
      <el-col :span="2" v-for="n in book.chapters" :key="book.abbr_en + '-' + n"><div class="grid-content ch-item"  @click="showVerses(abbr_en, n)"  :class="{active: isActive(n,chapter)}">{{n}}</div></el-col>
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
        book: {},
        chapter: 1,
        abbr_en: 'Gen',
        verses: [],
      };
    },
    created() {
      this.chapter = this.$route.query.chapter || 1;
      this.abbr_en = this.$route.params.abbr_en || 'Gen';
      this.book = this.$store.getters.book(this.abbr_en);
      this.getVerses(this.abbr_en, this.chapter);

      this.$electron.ipcRenderer.on('chapter-read-reply', (event, data) => {
        this.verses = data || [];
      });
    },
    methods: {
      getVerses(abbr_en, chapter) {
        this.abbr_en = abbr_en || 'Gen';
        this.chapter = chapter || 1;
        this.$electron.ipcRenderer.send('chapter-read', { abbr_en, chapter });
      },
      showVerses(abbr_en, chapter) {
        this.$router.push({ name: 'reader', params: { abbr_en }, query: { chapter } });
        this.getVerses(abbr_en, chapter);
      },
      isActive(chapter) {
        if (!this.chapter) this.chapter = 1;
        return this.chapter === chapter;
      },
    },
    destroyed() {
      this.$electron.ipcRenderer.removeAllListeners('chapter-read-reply');
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath !== from.fullPath) {
        this.getVerses(to.params.abbr_en, to.query.chapter);
      }
      if (to.params.abbr_en !== from.params.abbr_en) {
        this.book = this.$store.getters.book(to.params.abbr_en);
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