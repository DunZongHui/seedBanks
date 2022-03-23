import Mock from 'mockjs'
import echartsData from '@/mock/echartsData.json' 
Mock.mock('/mock/getEchartsData',{code:666,data:echartsData})