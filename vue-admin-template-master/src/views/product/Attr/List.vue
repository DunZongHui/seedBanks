<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShow="isShow"/>
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
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="remove(row.id)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                />
              </el-popconfirm>
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
          :disabled="!attrForm.attrName"
        >添加属性值</el-button>
        <el-button @click="isShow=true">取消</el-button>
        <el-table :data="attrForm.attrValueList" style="width: 100%,margin:20px 0" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{row,$index}">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="输入属性值名称"
                @keyup.native.13="toLook(row)"
                @blur="toLook(row)"
                size="mini"
              ></el-input>
              <span
                v-else
                style="display: block;width:100%"
                class="poiuyt"
                @click="toEdit(row,$index)"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row,$index}" }>
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index,1)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdate" :disabled="!attrForm.attrValueList.length">保存</el-button>
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
    //3级联动
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
    //获取平台属性列表
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
    //进入添加属性模式
    ShowAddDiv() {
      this.isShow = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
    },
    //添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //当前属性值对象属性值所属对象的id
        valueName: "",
        isEdit: true
      });
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    //进入修改属性模式
    showUpdata(row) {
      this.isShow = false;
      this.attrForm = cloneDeep(row);
      //对属性添加数据劫持
      this.attrForm.attrValueList.forEach(item => {
        this.$set(item, "isEdit", false);
      });
    },
    //删除属性
    async remove(attrID) {
      try {
        const re = await this.$API.attr.remove(attrID);
        if (re.code === 200 || re.code === 20000) {
          this.$message.success("平台属性删除成功");
          this.getAttrList();
        } else {
          this.$message.error("平台属性删除失败");
        }
      } catch (e) {
        this.$message.error("请求平台属性删除失败");
      }
    },
    //切换模式编辑
    toEdit(row, $index) {
      //将span转为input输入框
      row.isEdit = true;
      //从span变为input我们需要自动获取焦点
      //直接写这一行，input标签其实还没有创建成功，所以报错this.$refs[index]是undefined
      this.$nextTick(() => {
        this.$refs[$index].focus();
      });
    },
    //切换模式查看
    toLook(row) {
      //对输入的数据进行限制:空与重复
      let valueName = row.valueName;
      if (valueName.trim() === "") {
        row.valueName = "";
        return;
      }
      const re = this.attrForm.attrValueList.some(item => {
        //高级方法:参数或者返回值又是函数
        if (item !== row) {
          return item.valueName === valueName;
        }
      });
      if (re) {
        this.$message.error("重复请检查输入内容");
        return;
      }
      //将input输入框转为span
      row.isEdit = false;
    },
    //添加或修改数据后保存
    async addOrUpdate() {
      //1、获取参数
      let attr = this.attrForm;
      //2、整理参数
      // 1、属性值名称如果为空串，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性,这个isEdit是我们后面自己添加用来标识查看模式和编辑模式的
      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName !== "") {
          delete item.isEdit;
          return true;
        }
      });
      // 3、属性值列表如果没有属性值，不发请求
      if (attr.attrValueList.length === 0 ) {
        this.$message.info("属性值列表必须都有属性值才能保存");
        return;
      }
      try {
        const re = await this.$API.attr.addOrUpdate(attr);
        if (re.code === 200 || re.code === 20000) {
          this.$message.success("平台属性修改成功");
          this.isShow = true;
          this.getAttrList();
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
.el-tag.el-tag--light{margin-right: 5px;margin-bottom: 5px;}
</style>