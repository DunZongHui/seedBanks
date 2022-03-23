import { login, logout, getInfo } from "@/api/acl/user";
import cloneDeep from "lodash/cloneDeep"
import {
  default as router,
  allAsyncRoutes,
  constantRoutes,
  anyRoute,
  resetRouter
} from "@/router/index";
//递归，将权限数据对应的路由对象通过对比名字筛选出来
function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if (routeNames.indexOf(item.name) !== -1) {//是否存在权限数组中
      if (item.children && item.children.length) {//判断是否存在子路由需要筛选
        item.children = filterAsyncRoutes(item.children, routeNames);
      }
      return true;
    }
  });
  return asyncRoutes;//返回一个能够访问的路由对象配置
}

const state = {
  token: localStorage.getItem("vue_admin_template_token"),//初始化获取本地tonken，
  name: "",
  avatar: "",
  buttons: [],
  roles: [],
  routes: [] ,//用来遍历生成菜单，当前登录用户路由器注册的所有路由，是路由对象，
};
const mutations = {
  RESET_STATE: state => {
    // Object.assign(state, getDefaultState());
    state.token = "";
    state.name = "";
    state.avatar = "";
    state.buttons = [];
    state.roles = [];
    state.routes = [];
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, userinfo) => {//获取用户相关信息
    state.name = userinfo.name;
    state.avatar = userinfo.avatar;
    state.buttons = userinfo.buttons;
    state.roles = userinfo.roles;
  },
  SET_ROUTES(state, asyncRoute) {
    state.routes =constantRoutes.concat(asyncRoute,anyRoute)//将组件合并，返回一个包含所有路由的数组
    router.addRoutes([...asyncRoute, anyRoute]); //动态注册路由
  }
};

const actions = {
  // 登录
  async login({ commit }, userInfo) {//{ commit } <==> miniStore.commit
    const { username, password } = userInfo;
    const re = await login({ username: username.trim(), password: password });
    if (re.code === 20000 || re.code === 200) {
      commit("SET_TOKEN", re.data.token);
      localStorage.setItem("vue_admin_template_token", re.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
  //获取用户信息
  async getInfo({ commit, state }) {
    const re = await getInfo(state.token);
    if (re.code === 20000 || re.code === 200) {
      commit("SET_USERINFO", re.data);
      commit("SET_ROUTES", filterAsyncRoutes(cloneDeep(allAsyncRoutes), re.data.routes));
      return "ok";
    } else {
      return Promise.reject(
        new Error("Verification failed, please Login again.")
      );
    }
  },

  // 退出登录
  async logout({ commit, state }) {
    const re = await logout(state.token);
    if (re.code === 20000 || re.code === 200) {
      localStorage.removeItem("vue_admin_template_token");
      resetRouter();
      commit("RESET_STATE");
    } else {
      return Promise.reject(new Error("error"));
    }
  },

  // remove token
  resetToken({ commit }) {
    localStorage.removeItem("vue_admin_template_token");
    commit("RESET_STATE");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
