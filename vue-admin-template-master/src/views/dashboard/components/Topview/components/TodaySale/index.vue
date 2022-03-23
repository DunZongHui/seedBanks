<template>
  <div>
    <CommCard title="今日销售额" :count="salesToday | moneyFormat">
      <template v-slot:view>
        <div class="bigbox">
          <div class="top">
            <span>日同比</span>
            <span class="count">{{salesGrowthLastDay }}</span>
            <span :class="salesGrowthLastDay>0?'low':'up'"></span>
          </div>
          <div class="bottom">
            <span>月同比</span>
            <span class="count">{{salesGrowthLastMonth}}</span>
            <span :class="salesGrowthLastMonth>0?'low':'up'"></span>
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <span class="left">昨日销售额</span>
        <span class="right">{{salesLastDay}}</span>
      </template>
    </CommCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      salesToday: state => state.ecarths.echartsData.salesToday,
      salesLastDay: state => state.ecarths.echartsData.salesLastDay,
      salesGrowthLastDay: state => state.ecarths.echartsData.salesGrowthLastDay,
      salesGrowthLastMonth: state =>
        state.ecarths.echartsData.salesGrowthLastMonth
    })
  }
};
</script>

<style lang="scss" scoped>

.bigbox {
  font-size: 12px;
  font-weight: bold;
  color: #666;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  .top,
  .bottom {
    display: flex;
    justify-content: center;
  }
  .count {
    margin: 0 5px;
  }


}
</style>