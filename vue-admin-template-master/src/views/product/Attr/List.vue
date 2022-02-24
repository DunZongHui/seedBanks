<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="ShowAddDiv"
        >添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性列表" width="width">
            <template v-slot="{row,$index}">
              <el-tag
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{row,$index}">
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改"
                @click="showUpdata(row)"
              />
              <HintButton type="danger" size="mini" icon="el-icon-delete" title="删除" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form ref="form" :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!category3Id"
        >添加属性值</el-button>
        <el-button @click="isShow=true">取消</el-button>
        <el-table :data="attrForm.attrValueList" style="width: 100%,margin:20px 0" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{row,$index}">
              <el-input v-model="row.valueName" placeholder="输入属性值名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width"></el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdate">保存</el-button>
        <el-button @click="isShow=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShow: true,
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3
      }
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //子组件重新选择1级，清空父组件当中的23级和属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        //子组件重新选择2级，清空父组件当中的3级和属性列表
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        //发请求拿平台属性的列表数据
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      try {
        const re = await this.$API.attr.getList({
          category1Id,
          category2Id,
          category3Id
        });
        if (re.code === 200 || re.code === 20000) {
          this.attrList = re.data;
        } else {
          this.$message.error("获取平台属性列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取平台属性列表失败");
      }
    },
    ShowAddDiv() {
      this.isShow = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
    },
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //当前属性值对象属性值所属对象的id
        valueName: ""
      });
    },
    showUpdata(row) {
      this.isShow = false;
      this.attrForm = cloneDeep(row);
    },
    async addOrUpdate() {
      try {
        const re = await this.$API.attr.addOrUpdate(this.attrForm);
        if (re.code === 200 || re.code === 20000) {
          this.attrList = re.data;
        } else {
          this.$message.error("平台属性修改失败");
        }
      } catch (e) {
        this.$message.error("请求平台属性修改失败");
      }
    }
  }
};
</script>

<style>
</style>