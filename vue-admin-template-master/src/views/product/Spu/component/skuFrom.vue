<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" v-model="skuInfo.price" placeholder="价格(元)"></el-input>
    </el-form-item>
    <el-form-item label="重量(Kg)">
      <el-input type="number" placeholder="重量(Kg)" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" :rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form-item :label="attr.attrName" v-for="attr,index in attrList" :key="attr.id">
        <el-select placeholder="请选择" v-model="attr.valueId">
          <!-- //平台属性的选择收集 -->
          <el-option
            :label="item.valueName"
            v-for="item in attr.attrValueList"
            :value="`${attr.id}:${item.id}`"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form-item
        :label="saleAttr.saleAttrName"
        label-width="100px"
        v-for="saleAttr,index in skuSaleAttrList"
        :key="saleAttr.id"
      >
        <el-select placeholder="请选择" v-model="saleAttr.valueId">
          <!-- //销售属性的选择收集 -->
          <el-option
            v-for="item in saleAttr.spuSaleAttrValueList"
            :label="item.saleAttrValueName"
            :value="`${saleAttr.id}:${item.id}`"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="图片列表">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        :data="skuImageList"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template v-slot="{row,$index}">
            <img :src="row.imgUrl" style="width:100px;height:100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template v-slot="{row,$index}">
            <el-button
              type="primary"
              size="mini"
              v-if="row.isDefault === '0'"
              @click="changeDefault(skuImageList,row)"
            >设为默认</el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "skuFrom",
  data() {
    return {
      form: {},
      multipleSelection: [],
      spu: {},
      attrList: [],
      skuSaleAttrList: [],
      skuImageList: [],
      skuInfo: {
        //父组件传递
        spuId: 0,
        category3Id: "",
        tmId: 0,
        //v-model收集
        price: "",
        weight: "",
        skuDesc: "",
        skuName: "",
        //代码请求
        skuDefaultImg: "",
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: []
      }
    };
  },
  methods: {
    async getINitUpdateSKuFormData(row, category1Id, category2Id) {
      this.spu = row;
      const re0 = this.$API.attr.getList({
        category1Id,
        category2Id,
        category3Id: row.category3Id
      });
      const re1 = this.$API.sku.getSpuSaleAttrList(row.id);
      const re2 = this.$API.sku.getSpuImageList(row.id);
      const re = await Promise.all([re0, re1, re2]);
      this.attrList = re[0].data;
      this.skuSaleAttrList = re[1].data;
      let skuImageList = re[2].data;
      skuImageList.forEach(item => (item.isDefault = "0"));
      this.skuImageList = skuImageList;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //设置与收集默认
    changeDefault(skuImageList, row) {
      skuImageList.forEach(item => (item.isDefault = "0"));
      row.isDefault = "1";
      //设置默认
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async save() {
      let { skuInfo, spu, skuImageList, attrList, skuSaleAttrList } = this;
      skuInfo.category3Id = spu.category3Id;
      skuInfo.tmId = spu.tmId;
      skuInfo.spuId = spu.id;
      //图片的收集
      skuInfo.skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        };
      });
      //整理平台属性
      skuInfo.skuAttrValueList = attrList.reduce((prev, item) => {
        if (item.valueId) {
          let [attrId, valueId] = item.valueId.split(":");
          let obj = { attrId, valueId };
          prev.push(obj);
        }
        return prev;
      }, []);
      //销售属性
      skuInfo.skuSaleAttrValueList = skuSaleAttrList.reduce((prev, item) => {
        if (item.valueId) {
          let [saleAttrId, saleAttrIdValueId] = item.valueId.split(":");
          let obj = { saleAttrId, saleAttrIdValueId };
          prev.push(obj);
        }
        return prev;
      }, []);

      try {
        const re = await this.$API.sku.addUpdate(skuInfo);
       if (re.code === 200) {
          this.$message.success("保存sku成功");
          this.cancel();
          return 
        } else {
          this.$message.error("保存sku失败");
          
        }
      } catch (e) {       
        this.$message.error("请求保存sku失败");
      }
    },
    //清空data数据
    resetData() {
      //被修改的对象，修改之后的对象（调用生成初始化时对象）
      Object.assign(this._data, this.$options.data());
    },
    //点击取消
    cancel() {
      //返回到列表页
      this.$emit("update:isShowsSku", false);
      //清空数据
      this.resetData();
    }
  }
};
</script>

<style>
</style>