<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShow="!isShowsSpu && !isShowsSku" />
    </el-card>
    <el-card style="margin-top:20px">
      <!-- spu列表 -->
      <div v-show="!isShowsSpu && !isShowsSku">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm()"
        >添加Spu属性</el-button>
        <el-table :data="spuList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
                @click="showSkuList(row)"
              ></HintButton>
              <el-popconfirm :title="`你确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--  @size-change="handleSizeChange"
        @current-change="handleCurrentChange"-->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout=" prev, pager, next, jumper,->,sizes,total"
        ></el-pagination>
      </div>
      <!-- 添加或修改spu -->
      <!-- <SpuFrom v-show="isShowsSpu" :isShowsSpu="isShowsSpu"  @update:isShowsSpu = "isShowsSpu=$eventF"/> -->
      <SpuFrom
        v-show="isShowsSpu"
        :isShowsSpu.sync="isShowsSpu"
        ref="spu"
        @backSuccess="backSuccess"
      />
      <!-- 添加sku -->
      <SkuFrom v-show="isShowsSku" :isShowsSku.sync="isShowsSku" />
    </el-card>
  </div>
</template>

<script>
import SkuFrom from "@/views/product/Spu/component/skuFrom";
import SpuFrom from "@/views/product/Spu/component/spuFrom";
export default {
  name: "Spu",
  components: { SkuFrom, SpuFrom },
  data() {
    return {
      isShowsSku: false,
      isShowsSpu: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 2,
      total: 0,
      spuList: []
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
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        //子组件重新选择2级，清空父组件当中的3级和属性列表
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        //发请求拿平台属性的列表数据
        this.getSpuList();
      }
    }, //请求数据
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const re = await this.$API.spu.getList(page, limit, category3Id);
      if (re.code === 200) {
        this.spuList = re.data.records;
        this.total = re.data.total;
      } else {
        this.$message.error("Spu列表获取失败");
      }
    }, //页面跳转
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    }, //添加spu
    showAddSpuForm() {
      this.isShowsSpu = true;
      this.$refs.spu.getINitAddSpuFormData(this.category3Id);
    }, //添加sku
    showAddSkuForm() {
      this.isShowsSku = true;
    }, //修改spu
    showUpdateSpuForm(row) {
      this.isShowsSpu = true;
      this.$refs.spu.getINitUpdateSpuFormData(row, this.category3Id);
      //子组件开始请求
    },
    //spu保存成功
    backSuccess(id) {
      if (id) {
        //修改成功
        this.getSpuList(this.page);
      } else {
        //添加成功
        this.getSpuList();
      }
    },
    //删除spu
    async deleteSpu(row) {
      try {
        const re = await this.$API.spu.remove(row.id);
        if (re.code === 200) {
          this.$message.success("删除spu成功");
          this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
        } else {
          this.$message.success("删除spu失败");
        }
      } catch (error) {
        this.$message.success("请求删除spu失败");
      }
    }
  }
};
</script>

<style>
</style>