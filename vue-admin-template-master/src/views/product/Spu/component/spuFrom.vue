<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="品牌">
          <el-option
            v-for="item in trademarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" type="textarea" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="unUseSaleAttrList.length>
          0
          ? `还有${unUseSaleAttrList.length}未选择`
          : '没有啦！！！'
          "
        >
          <el-option
            :label="item.name"
            v-for="item in unUseSaleAttrList"
            :value="`${item.id}:${item.name}`"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!unUseSaleAttrIdName"
        >添加销售属性</el-button>
      </el-form-item>
    </el-form>
    <el-table style="width: 100%" :data="spuForm.spuSaleAttrList" border>
      <el-table-column prop="prop" label="序号" type="index" width="80"></el-table-column>
      <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
      <el-table-column prop="prop" label="属性名列表" width="width">
        <template slot-scope="{ row, $index }">
          <!--  "点击×的回调 -->
          <el-tag
            closable
            :disable-transitions="false"
            v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
            :key="saleAttrValue.id"
            @close="row.spuSaleAttrValueList.splice(index, 1)"
          >{{ saleAttrValue.saleAttrValueName }}</el-tag>

          <!-- v-model="row.inputValue" 
              inputValue必须是输入了数据，row身上才有这个属性
          如果用户没有输入数据，那么row身上开始是不存在这个属性的-->
          <el-input
            class="input-new-tag"
            v-if="row.inputVisible"
            v-model="row.saleAttrValueName"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(row)"
            @blur="handleInputConfirm(row)"
          ></el-input>
          <!--  -->
          <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row,$index}">
          <HintButton
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除销售属性"
            @click="spuForm.spuSaleAttrList.splice($index, 1)"
          ></HintButton>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "spuFrom",
  data() {
    return {
      form: {},
      dialogImageUrl: "",
      category3Id: "",
      dialogVisible: false,
      spuImageList: [],
      trademarkList: [],
      saleAttrList: [],
      unUseSaleAttrIdName: "",
      spuForm: {
        category3Id: "",
        tmId: "",
        description: "",
        spuName: "",
        spuSaleAttrList: [],
        spuImageList: []
      }
    };
  },
  methods: {
    //图片的删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList; //先暂存，后期保存时合并到数据中
    },
    //图片的预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传成功
    handleAvatarSuccess(res, file, fileList) {
      this.spuImageList = fileList;
      // this.imageUrl = URL.createObjectURL(file.raw);//本地路径
    },
    //$refs父组件使用，子组件的方法请求数据
    async getINitUpdateSpuFormData(spu, id) {
      this.category3Id = id;
      try {
        const reSpuId = await this.$API.spu.get(spu.id);
        if (reSpuId.code === 200) {
          this.spuForm = reSpuId.data;
        }
        const reSpuImg = await this.$API.spu.getSpuImageList(spu.id);
        if (reSpuImg.code === 200) {
          reSpuImg.data.forEach(item => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });
          this.spuImageList = reSpuImg.data;
        }
        const retrademark = await this.$API.trademark.getList();
        if (retrademark.code === 200) {
          this.trademarkList = retrademark.data;
        }
        const reSpuAttrList = await this.$API.spu.getSaleAttrList();
        if (reSpuAttrList.code === 200) {
          this.saleAttrList = reSpuAttrList.data;
        }
      } catch (error) {
        this.$message.error("修改请求的初始化失败");
      }
    },
    async getINitAddSpuFormData(id) {
      this.category3Id = id;
      try {
        const reSpuAttrList = await this.$API.spu.getSaleAttrList();
        if (reSpuAttrList.code === 200) {
          this.saleAttrList = reSpuAttrList.data;
        }
        const retrademark = await this.$API.trademark.getList();
        if (retrademark.code === 200) {
          this.trademarkList = retrademark.data;
        }
      } catch (error) {
        this.$message.error("添加请求的初始化失败");
      }
    },
    //添加销售属性
    addSaleAttr() {
      //点击按钮，通过刚才选择select收集到的数据，获取收集到的销售属性id和name
      let [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(":");
      // 把收集到的数据变为要添加的对象格式
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      // 把销售属性对象添加到spu的销售属性列表当中
      this.spuForm.spuSaleAttrList.push(obj);

      this.unUseSaleAttrIdName = ""; //清空收集的数据
    },
    //销售属性值输入模式的切换
    showInput(row) {
      //添加响应式数据
      this.$set(row, "inputVisible", true);
      //点击切换input的时候，保证row身上有inputValue属性，不至于拿到undefined
      this.$set(row, "saleAttrValueName", "");
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //input输入完成,进行校验,切换
    handleInputConfirm(row) {
      let { saleAttrValueName, baseSaleAttrId } = row;
      //拿到属性值名称，判断是否是空串
      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some(
        item => item.saleAttrValueName === saleAttrValueName
      );
      if (isRepeat) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //销售属性值名称没问题，我们就构造成我们需要的销售属性值对象
      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      };

      row.spuSaleAttrValueList.push(obj); //把销售属性值添加到指定的销售属性值列表
      //将input当中的数据清空
      row.inputValue = "";
      //把input再变为按钮
      row.inputVisible = false;
    },
    //保存且请求
    async save() {
      //1、获取参数数据
      let { spuForm, spuImageList, category3Id } = this;
      //2、整理参数
      //整理category3Id
      spuForm.category3Id = category3Id;
      //整理图片列表
      spuForm.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.imgUrl || item.response.data
      }));
      //整理销售属性，去除销售属性身上不需要的数据
      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputVisible;
        delete item.inputValue;
      });
      //3、发请求
      try {
        //4、成功干啥
        await this.$API.spu.addUpdate(spuForm);
        //提示
        this.$message.success("保存spu成功");
        //返回到列表页
        this.$emit("update:isShowSpu", false);
        //通知返回列表页成功，在列表页发请求重新获取列表数据
        this.$emit("backSuccess", spuForm.id);
        //返回成功后把当前spuform页面的数据清空
        this.resetData();
      } catch (error) {
        //5、失败干啥
        //提示
        this.$message.error("保存spu失败");
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
      this.$emit("update:isShowSpu", false);
      //通知父组件回来
      this.$emit("backSuccess");
      //清空数据
      this.resetData();
    }
  },
  computed: {
    //根据请求获取的所有的销售属性列表saleAttrList和spu详情当中自己的销售属性列表spuForm.spuSaleAttrList 计算得到未选择的销售属性列表
    unUseSaleAttrList() {
      //从所有的销售属性列表当中过滤，不在spu自己的销售属性列表当中的 所有销售属性
      // return this.saleAttrList.filter(saleAttr => {
      //   return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
      //     return spuSaleAttr.saleAttrName !== saleAttr.name
      //   })
      // })
      return this.saleAttrList.filter(saleAttr =>
        this.spuForm.spuSaleAttrList.every(
          spuSaleAttr => spuSaleAttr.saleAttrName !== saleAttr.name
        )
      );
    }
  }
};
</script>

<style>
</style>