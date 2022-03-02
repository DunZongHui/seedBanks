<template>
  <div>
      Dtest1
      <el-button type="primary" v-if="$showButton('but.add')" >添加</el-button>

      <el-button type="warning" v-if="$showButton('but.change')">修改</el-button>
  </div>
</template>

<script>
export default {
name:"Dtest1"
}
</script>

<style>

</style>