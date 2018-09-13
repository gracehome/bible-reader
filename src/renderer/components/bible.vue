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
      this.$electron.ipcRenderer.send('get-books', this.$store.state.bible.location.version);
      this.$electron.ipcRenderer.on('get-books-reply', (event, items) => {
        this.books = items;
        this.$store.commit('setbooks', items);
      });
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