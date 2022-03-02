<template>
  <el-card>
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="120"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{row,$index}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <HintButton
            type="success"
            icon="el-icon-top"
            v-if="row.isSale == 1"
            size="mini"
            title="上架中"
            @click="cancelSale(row)"
          ></HintButton>
          <HintButton
            type="info"
            v-else
            icon="el-icon-bottom"
            size="mini"
            title="已下架"
            @click="onSale(row)"
          ></HintButton>
          <HintButton
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改sku"
            @click="UpSkudata"
          ></HintButton>
          <HintButton
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看SKU信息"
            @click="showSkuId(row)"
          ></HintButton>
          <el-popconfirm :title="`你确定删除${row.skuName}吗？`" @onConfirm="remove(row)">
            <HintButton
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除SkU"
            ></HintButton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- "
    @current-change="handleCurrentChange"-->
    <el-pagination
      :current-page="page"
      @size-change="handleSizeChange"
      @current-change="getList"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      :pager-count="5"
      layout="sizes, prev, pager, next, jumper,->,total"
      :total="total"
    ></el-pagination>

    <el-drawer :visible.sync="drawer" size="50%" :with-header="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag
            type="success"
            v-for="item in skuInfo.skuAttrValueList"
            :key="item.id"
          >{{item.attrName+"："+item.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:400px;height:400px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      skuList: [],
      limit: 10,
      page: 1,
      total: 0,
      drawer: false,
      skuInfo: {
        skuName: "",
        skuDesc: "",
        price: 0,
        skuAttrValueList: [],
        skuImageList: []
      }
    };
  },
  methods: {
    //列表数据请求
    async getList(page = 1) {
      this.page = page;
      try {
        const re = await this.$API.skuList.getList(this.page, this.limit);
        if (re.code === 200) {
          this.skuList = re.data.records;
          this.total = re.data.total;
        } else {
        }
      } catch (error) {}
    },
    //修改单页显示
    handleSizeChange(limit) {
      this.limit = limit;
      this.getList();
    },
    //显示详情
    async showSkuId(row) {
      this.drawer = true;
      const re = await this.$API.skuList.getDrawer(row.id);
      this.skuInfo = re.data;
    },
    //修改数据未开发
    UpSkudata() {
      this.$message.info("还在开发中！！！");
    },
    //删除数据
    async remove(row) {
      try {
        const re = await this.$API.skuList.remove(row.id);
        if (re.code === 200) {
          this.$message.success("sku数据删除成功");
          this.getList(this.skuList.lenght > 1 ? this.page : this.page - 1);
        } else {
          this.$message.success("sku数据删除失败");
        }
      } catch (error) {
        this.$message.success("请求sku数据删除成功");
      }
    },
    //上架
    onSale(row) {
      this.$API.skuList
        .onSale(row.id)
        .then(val => {
          this.$message.success("上架成功");
          this.getList(this.page);
        })
        .catch(e => {
          this.$message.success("上架失败");
        });
    },
    //下架
    cancelSale(row) {
      this.$API.skuList
        .cancelSale(row.id)
        .then(val => {
          this.$message.success("下架成功");
          this.getList(this.page);
        })
        .catch(e => {
          this.$message.success("下架失败");
        });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss">
.el-row {
  height: 40px;
  .el-col {
    line-height: 40px;
    &.el-col-5 {
      font-size: 18px;
      font-weight: bold;
      text-align: right;
      margin-right: 20px;
    }
  }
}

.sku-carousel {
  width: 400px;
  border: 1px solid #ccc;
}
</style>