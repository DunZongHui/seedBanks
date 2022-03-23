import {reqReportData} from "@/api/Mockdata"

const state = {
 echartsData:{}
}

const mutations = {
SET_ECHARTSDATA(state,data){
    state.echartsData = data
}
}

const actions = {
 async getechartsData({commit}){
     const re = await reqReportData()
     if(re.code === 666){
         commit("SET_ECHARTSDATA",re.data)
     }
 }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
