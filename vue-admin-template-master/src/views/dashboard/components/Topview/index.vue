<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale />
      </el-col>
      <el-col :span="6">
        <TodayOrder />
      </el-col>
      <el-col :span="6">
        <TotalUser />
      </el-col>
      <el-col :span="6">
        <TradeUser />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TodayOrder from "./components/TodayOrder";
import TodaySale from "./components/TodaySale";
import TotalUser from "./components/TotalUser";
import TradeUser from "./components/TradeUser";
export default {
  name: "Topview",
  components: {
    TodayOrder,
    TodaySale,
    TotalUser,
    TradeUser
  }
};
</script>

<style lang="scss" scoped >
::v-deep .left {
  margin-right: 5px;
}
::v-deep .up {
  border: 6px solid greenyellow;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
::v-deep   .low {
    border: 6px solid red;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
</style>