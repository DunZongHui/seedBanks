<template>
  <div>
    <CommCard title="今日交易用户数" :count="orderUser | numberFormat">
      <template v-slot:view>
        <v-chart :options="getOptions()" autoresize></v-chart>
      </template>
      <template v-slot:bottom>
        <span class="left">退货率</span>
        <span class="right">{{returnRate}}</span>
      </template>
    </CommCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TotalUser",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      orderUser: state => state.ecarths.echartsData.orderUser,
      returnRate: state => state.ecarths.echartsData.returnRate,
      orderUserTrend: state => state.ecarths.echartsData.orderUserTrend,
      orderUserTrendAxis: state => state.ecarths.echartsData.orderUserTrendAxis
    }),
    
  },
  methods:{
    getOptions() {
      return {
        tooltip: {
          trigger: "axis"
        }, //提示

        xAxis: {
          //x轴
          // show: true,
          data: this.orderUserTrendAxis || []
        },
        yAxis: {
          //y轴
          show: false
        },
        grid: {
          //图的位置
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        },
        series: [
          //系列；图的样式
          {
            name: "交易量",
            type: "bar",
            barWidth:"60%",
            data: this.orderUserTrend || [],
            itemStyle: {
              color: "blue"
            }

          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>