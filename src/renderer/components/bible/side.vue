<template>
  <div>
    <router-link :to="{name: 'home'}">
      <el-row>
        <el-col :span="24" class="logo">
          <img src="@/assets/bible-logo.svg" alt="" style="height:40px;">
        </el-col>
      </el-row>
    </router-link>
    <el-row>
      <el-col :span="24">
        <el-menu class="el-menu-vertical-demo" :router="true">
          <el-submenu v-for="book in books" :key="book.id" :index="'submenu-' + book.id">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>{{book.name_cn}}</span>
            </template>            
            <el-menu-item v-for="chapter in book.chapters" :index="book.id +'-item-' + chapter"  :key="book.id + '-item-' + chapter" :route="{name: 'reader', params: {book: book.id, chapter: chapter}}">{{chapter}}章</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'side',
    props: ['books'],
  };
</script>

<style>
  .logo {
    text-align: center;
    border-bottom: solid gainsboro;
  }

  .el-menu-item-group__title {
    color: green;
  }

  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 45px;
    min-width: 200px;
}
</style>