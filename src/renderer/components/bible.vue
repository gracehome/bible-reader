<template>
  <div id="bible">
    <el-container class="container">
      <el-aside width="200px" class="side">
        <Side :books="books"></Side>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import Side from './bible/side';

  export default {
    name: 'bible',
    components: {
      Side,
    },
    data() {
      return {
        books: [],
      };
    },
    created() {
      this.books = this.$store.getters.books;
    },
  };

</script>

<style>
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