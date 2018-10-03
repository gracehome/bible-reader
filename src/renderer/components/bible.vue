<template>
  <div id="bible">
    <el-container class="container">
      <el-aside width="200px" class="side">
        <Side :scriptures="scriptures"></Side>
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
        scriptures: [],
      };
    },
    created() {
      this.$electron.ipcRenderer.send('get-scriptures', this.$route.params.version);
      this.$electron.ipcRenderer.on('get-scriptures-reply', (event, items) => {
        this.scriptures = items;
        this.$store.commit('setscriptures', items);
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