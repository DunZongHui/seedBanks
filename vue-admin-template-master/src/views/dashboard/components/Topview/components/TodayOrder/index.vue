<template>
  <div>
    <CommCard title="今日订单量" :count="orderToday | numberFormat">
      <template v-slot:view>
        <div ref="canvasbox" class="canvasbox"></div>
      </template>
      <template v-slot:bottom>
        <span class="left">昨日订单量</span>
        <span class="right">{{orderLastDay}}</span>
      </template>
    </CommCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash/debounce"
export default {
  name: "TodayOrder",
  data() {
    return {
      myChart: null
    };
  },
  computed: {
    ...mapState({
      orderToday: state => state.ecarths.echartsData.orderToday,
      orderLastDay: state => state.ecarths.echartsData.orderLastDay,
      orderTrend: state => state.ecarths.echartsData.orderTrend,
      orderTrendAxis: state => state.ecarths.echartsData.orderTrendAxis
    })
  },
  mounted() {
    //实例化echarts对象
    this.myChart = this.$echarts.init(this.$refs.canvasbox);
    this.myChart.setOption(this.getOptions());
    window.addEventListener("resize", debounce(this.handlerSizes,200))
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handlerSizes);
  },
  watch: {
    orderTrend: {
      handler() {
        this.myChart.setOption(this.getOptions());
      }
    }
  },
  methods: {
    getOptions() {
      return {
        // title: {//标题
        //  text: "ECharts 入门示例"
        // },
        //  legend: {//图例
        //   data: ["销量"]
        // },
        tooltip: {
          trigger: "axis"
        }, //提示

        xAxis: {
          //x轴
          show: false,
          data: this.orderTrendAxis || []
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
            name: "订单",
            type: "line",
            data: this.orderTrend || [],
            itemStyle: {
              //
              opacity: 0,
              color: "red"
            },
            lineStyle: {
              //线的样式
              opacity: 0
            },
            areaStyle: {
              //阴影颜色
              color: "pink"
            },
            smooth: true //取消尖角
          }
        ]
      };
    },
    handlerSizes() {

      this.myChart.resize();
    }
  }
};
</script>

<style lang="scss" scoped>
.canvasbox {
  width: 100%;
  height: 50px;
}
</style>