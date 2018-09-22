<template>
  <div class="bible-index">
    <p v-if="language=='cn'">旧约</p>
    <p v-else>Old Testament</p>
    <el-row :gutter="10">
      <el-col :span="4" v-for="(scripture, index) in oldBooks" :key="'old-' + index" class="scripture-item">
        <router-link :to="{name: 'reader', params: {version: scripture.version, scripture: scripture.id, chapter: 1}, query: {language: language}}">
          <el-card shadow="hover" class="scripture-body">
            <small class="name" v-if="language=='cn'">{{scripture.name_cn}}</small>
            <small class="name" v-else>{{scripture.name_en}}</small>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <p v-if="language=='cn'">旧约</p>
      <p v-else>New Testament</p>
      <el-col :span="4" v-for="(scripture, index) in newBooks" :key="'new-' + index" class="scripture-item">
        <router-link :to="{name: 'reader', params: {version: scripture.version, scripture: scripture.id, chapter: 1}, query: {language: language}}">
          <el-card shadow="hover" class="scripture-body">
            <small class="name" v-if="language=='cn'">{{scripture.name_cn}}</small>
            <small class="name" v-else>{{scripture.name_en}}</small>
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
        language: 'cn',
      };
    },
    created() {
      this.language = this.$route.query.language || 'cn';
      this.oldBooks = this.getOldBooks;
      this.newBooks = this.getNewBooks;
    },
    methods: {
      getOldNew(oldnew) {
        return this.$store.getters.oldnew(oldnew);
      },
    },
    computed: {
      getOldBooks() {
        return this.getOldNew('old');
      },
      getNewBooks() {
        return this.getOldNew('new');
      },
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

  .scripture-item {
    padding-top: 5px;
    text-align: center;
  }

  .scripture-body {
    cursor: pointer;
  }

  .scripture-body:hover {
    border: solid green 1px;
  }
</style>