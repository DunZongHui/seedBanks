<template>
  <el-form :inline="true" :disabled="!isShow">
    <el-form-item label="一级分类">
      <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handlerCategory1" >
        <el-option v-for="c1,index in category1List" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handlerCategory2">
        <el-option v-for="c2,index in category2List" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handlerCategory3" >
        <el-option v-for="c3,index in category3List" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",
  props: ["isShow"],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      }
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {    
      try {
        const re = await this.$API.CategorySelector.getCategory1();
        if (re.code === 200 || re.code === 20000) {
          this.category1List = re.data;
        } else {
          this.$message.error("获取一级列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取一级列表失败");
      }
    },
    async handlerCategory1(category1Id) {
      //一级目录选中值发生变化时触发函数
      //用户选中1级需要清空23级
      this.category2List = [];
      this.category3List = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      //向父组件传递数据
      this.$emit("changeCategory", { categoryId: category1Id, level: 1 });

      try {
        const re = await this.$API.CategorySelector.getCategory2(category1Id);
        if (re.code === 200 || re.code === 20000) {
          this.category2List = re.data;
        } else {
          this.$message.error("获取二级列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取二级列表失败");
      }
    },
    async handlerCategory2(category2Id) {
      //清除3级列表状态
      this.category3List = [];
      this.cForm.category3Id = "";
      this.$emit("changeCategory", { categoryId: category2Id, level: 2 });

      //2级目录

      try {
        const re = await this.$API.CategorySelector.getCategory3(category2Id);
        if (re.code === 200 || re.code === 20000) {
          this.category3List = re.data;
        } else {
          this.$message.error("获取三级列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取三级列表失败");
      }
    },
    async handlerCategory3(category3Id) {
      //3级目录改变触发
      this.$emit("changeCategory", { categoryId: category3Id, level: 3 });
    },
    fn(bloo){
      console.log(bloo);
      
    }
  }
};
</script>

<style>
</style>