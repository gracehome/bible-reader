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
    font-family: "Microsoft YaHei", Arial, sans-serif;
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