import Vue from 'vue'
//引入原生echarts
// import echarts from 'echarts'
import * as echarts from 'echarts'
// import * as echarts from 'echarts/lib/echarts.js'/
//引入vue插件echarts
import ECharts from 'vue-echarts'
//使用echarts
Vue.prototype.$echarts = echarts

Vue.component('v-chart', ECharts)