<template>
  <div>
    <CommCard title="累计用户数" :count="usersTotal | numberFormat">
      <template v-slot:view>
        <v-chart :options="getOptions()" autoresize></v-chart>
      </template>
      <template v-slot:bottom>
        <div class="boxtwo">
          <div class="leftdiv">
            <span>日同比</span>
            <span class="left">{{userGrowthLastDay}}</span>
            <span :class="userGrowthLastDay>0?'low':'up'"></span>
          </div>
          <div class="rightdiv">
            <span>月同比</span>
            <span class="left">{{userGrowthLastMonth}}</span>
            <span :class="userGrowthLastMonth>0?'low':'up'"></span>
          </div>
        </div>
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
      usersTotal: state => state.ecarths.echartsData.usersTotal,
      usersLastDay: state => state.ecarths.echartsData.usersLastDay,
      usersLastMonth: state => state.ecarths.echartsData.usersLastMonth,
      userGrowthLastDay: state => state.ecarths.echartsData.userGrowthLastDay,
      userGrowthLastMonth: state =>
        state.ecarths.echartsData.userGrowthLastMonth
    })
  },
  methods: {
    getOptions() {
      return {
        tooltip: {}, //提示

        xAxis: {
          //x轴
          show: false,
          type: "value",
          max: this.usersTotal,
          min: 0,
          // 去掉两边留白
          boundaryGap: false,
        },
        yAxis: {
          //y轴
          type: "category",
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
            barWidth: "30%",
            data: [this.usersTotal - this.usersLastMonth] || [],
            itemStyle: {
              color: "pink"
            },
            showBackground: true
          }
        ],
        label: {
          show: true, // 显示
          formatter: '|', // 显示的具体内容
          position: 'right', // 内容的位置
          distance: 40 // 间隔距离

        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.boxtwo {
  display: flex;
  justify-content: space-between;
  .leftdiv,
  .rightdiv {
    display: flex;
    .left {
      margin: 0 5px;
    }
  }
}
</style>