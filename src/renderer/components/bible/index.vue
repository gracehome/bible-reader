<template>
  <div class="bible-index">
    <p>旧约</p>
    <el-row :gutter="10">
      <el-col :span="4" v-for="(book, index) in oldBooks" :key="'old-' + index" class="book-item">
        <router-link :to="{name: 'reader', params: {version: book.version, book: book.id, chapter: 1}}">
          <el-card shadow="hover" class="book-body">
            <small class="name">{{book.name_cn}}</small>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <h4>新约</h4>
      <el-col :span="4" v-for="(book, index) in newBooks" :key="'new-' + index" class="book-item">
        <router-link :to="{name: 'reader', params: {version: book.version, book: book.id, chapter: 1}}">
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
      this.oldBooks = this.getOldBooks;
      this.newBooks = this.getNewBooks;
    },
    methods: {
      getOldNew(oldnew) {
        return this.$store.getters.oldnew(oldnew);
      },
    },
    computed: {
      getOldBooks() { return this.getOldNew('old'); },
      getNewBooks() { return this.getOldNew('new'); },
    },
    watch: {
      getOldBooks(oldBooks) {
        this.oldBooks = oldBooks;
      },
      getNewBooks(newBooks) {
        this.newBooks = newBooks;
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