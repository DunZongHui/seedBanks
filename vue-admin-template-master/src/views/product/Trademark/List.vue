<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%;margin:20px 0">
      <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" width="width" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template v-slot="{row,$index}" }>
          <!-- <div style="width:80px;heigth:100px"></div> -->
          <img :src="row.logoUrl" alt style="width:80px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row,$index}">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDateTradmark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @current-change="handleCurrentChange"//改变页码
      @size-change="handleSizeChange"//改变显示数量
      事件触发后传递数据给父级，重新发送请求
    -->
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->, sizes, total"
    ></el-pagination>
    <!-- 添加或修改表单 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="tmForm">
        <!-- :model="tmForm" 用来后期进行表单验证 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var validatetmName = (rule, value, callback) => {
      //参：当前规则(一般无意义)，要验证的数据，调用(有参报错，无验证通过)
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称长为2-10位字符"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false, //对话框的开关
      tmForm: {
        tmName: "", //收集我们的品牌名称
        logoUrl: "" //收集我们的品牌logo图片路径
      }, //收集数据{'logoUrl':'string','tmName':'string'}
      rules: {
        //规则/报错信息/校验方式：blur失去焦点时，change 发生改变时 ，整体校验
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validatetmName }
        ],
        logoUrl: [
          { required: true, message: "请点击上传图片", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    //切换页数，初始化请求
    async getTrademarkList(page = 1) {
      this.page = page;
      try {
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        if (result.code === 20000 || result.code === 200) {
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取品牌列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取品牌列表失败");
      }
    },
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getTrademarkList();
    // },
    //切换每页显示数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarkList();
    },
    //上传相关函数
    //上传成功的函数
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw);//本地路径
    },
    //上传之前的函数，限制图片大小及格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击添加按钮弹出添加品牌的dialog对话框
    showAddDialog() {
      this.dialogFormVisible = true;
      //把tmForm内的数据清空 如果不清空，添加数据点取消，再点添加，数据还存在
      this.tmForm = {
        tmName: "", //收集我们的品牌名称
        logoUrl: "" //收集我们的品牌logo图片路径
      };
    },
    //修改品牌数据
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    //点击确定按钮发请求添加或者修改品牌
    addOrUpdate() {
      //1.获取参数
      let trademark = this.tmForm; //tmForm就是咱们添加或者修改最终收集到的品牌数据
      //2.整理参数 一般是我们的参数数据不符合咱们请求的参数格式，那么就需要整理
      this.$refs.tmForm.validate(async valid => {
        //进行校验
        if (valid) {
          //3.发请求
          try {
            //4.成功干啥
            const re = await this.$API.trademark.addOrUpdata(trademark);
            if (re.code === 20000 || re.code === 200) {
              //4.1、提示
              this.$message.success(
                trademark.id ? "修改品牌成功" : "添加品牌成功"
              );
              //4.2、关闭dialog,回到列表页
              this.dialogFormVisible = false;
              //4.3、重新发请求获取列表页数据
              // 如果添加成功，那么重新请求的是第一页数据，添加新的数据是在最后一页
              // 如果是修改成功，那么我们得重新请求这条数据所在的页
              this.getTrademarkList(trademark.id ? this.page : 1);
            } else {
              this.$message.error(
                trademark.id ? "修改品牌失败" : "添加品牌失败"
              );
            }
          } catch (error) {
            //失败干啥
            this.$message.error(
              trademark.id ? "请求修改品牌失败" : "请求添加品牌失败"
            );
          }
        } else {
          this.$message.error("请重新核对输入内容")
          return false;
        }
      });
    },
    removeDateTradmark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const re = await this.$API.trademark.remove(row.id);
            if (re.code === 200 || re.code === 20000) {
              this.$message.success("删除成功");
              //判断当前页数据条数将决定删除后展示的页面
              this.getTrademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.error("删除失败");
            }
          } catch (error) {
            this.$message.error("请求删除成功");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消删除${row.tmName}`
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>