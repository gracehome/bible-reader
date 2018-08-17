<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'bibleApp',
  };
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  a:link {
    text-decoration: none;
    cursor: pointer;
  }

  a:visited {
    text-decoration: none;
    cursor: pointer
  }

  a:active {
    text-decoration: none;
    cursor: pointer
  }

  a:hover {
    text-decoration: none;
    cursor: pointer
  }
</style>