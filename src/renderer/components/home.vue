<template>
  <div id="home">
    <el-container class="container">
      <el-aside width="200px" class="side">
        <el-row>
          <el-col :span="24" class="logo">
            <img src="@/assets/bible-logo.svg" alt="" style="height:40px;">
          </el-col>
        </el-row>
        <el-row>
          <p>你们当站在路上察看，访问古道，哪是善道，便行在其间；这样，你们心里必得安息。</p>
          <small class="right">—— 耶利米书6:16</small>
        </el-row>
      </el-aside>
      <el-main>
        <el-row>
          <el-alert title="今日经文" type="success" :closable="false" :description="scripture">
          </el-alert>
        </el-row>
        <el-row class="menu" :gutter="20">
          <router-link :to="{name: 'bibleIndex', params: {name_cn: '创'}}">
            <el-col :span="6" class="menu-item bg-blue">
              <el-card shadow="hover">
                圣经阅读
              </el-card>
            </el-col>
          </router-link>
          <a href="">
            <el-col :span="6" class="menu-item">
              <el-card shadow="hover">
                书籍阅读
              </el-card>
            </el-col>
          </a>
          <a href="">
            <el-col :span="6" class="menu-item">
              <el-card shadow="hover">
                读书笔记
              </el-card>
            </el-col>
          </a>
          <a href="">
            <el-col :span="6" class="menu-item">
              <el-card shadow="hover">
                在线交流
              </el-card>
            </el-col>
          </a>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data() {
      return {
        scripture: '不从恶人的计谋、不站罪人的道路、不坐亵慢人的座位、惟喜爱耶和华的律法、昼夜思想、这人便为有福。 --诗篇1:1-2',
      };
    },
  };
</script>

<style>
  .side {
    border-right: solid gainsboro;
    background-color: #fafafa;
    padding: 5px;
  }

  .logo {
    text-align: center;
    border-bottom: solid gainsboro;
  }

  .container {
    height: 100vh;
  }

  .right {
    float: right;
  }

  .menu {
    margin-top: 2rem;
  }

  .menu-item {
    text-align: center;
    font-size: 1.2rem;
  }
</style>