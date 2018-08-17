<template>
  <div class="bible-index">
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
</template>

<script>
  export default {
    name: 'bibleIndex',
    data() {
      return {
        oldBooks: [],
        newBooks: [],
      };
    },
    created() {
      this.oldBooks = this.$store.getters.category('old');
      this.newBooks = this.$store.getters.category('new');
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