<template>
  <el-card>
    <div class="main">
      <div class="title">{{title}}</div>
      <div class="count">{{count}}</div>
      <div class="view">
        <slot name="view"></slot>
      </div>
      <div class="line"></div>
      <div class="bottom">
        <slot name="bottom"></slot>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "CommCard",
  data() {
    return {};
  },
  props:["title",'count']
};
</script>

<style lang="scss" scoped>
.main {
  .title {
    font-size: 12px;
    color: #bbb;
  }
  .count {
    font-size: 24px;
    letter-spacing: 1px;
  }
  .view {
    height: 50px;
  }
  .line {
    // border-bottom: 2px solid #666;
    height: 2px;
    background-color: #666;
    margin: 10px 0;
  }
  .bottom {
    font-size: 12px;
    color: #bbb;
  }
}
</style>