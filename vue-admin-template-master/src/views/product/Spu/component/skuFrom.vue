<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="SPU名称">SPU名称</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)"></el-input>
    </el-form-item>
    <el-form-item label="重量(Kg)">
      <el-input placeholder="重量(Kg)"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form-item label="手机一级">
        <el-select placeholder="请选择" value>
          <el-option value></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form-item label="颜色">
        <el-select placeholder="请选择" value>
          <el-option value></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="data" style="width: 100%" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="prop" label="图片" width="width"></el-table-column>
        <el-table-column prop="prop" label="名称" width="width"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('update:isShowsSku',false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "skuFrom",
  data() {
    return {
      form: {},
      data: []
    };
  }
};
</script>

<style>
</style>