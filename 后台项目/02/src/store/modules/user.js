import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

const state = {
  token: getToken(),
  name: "",
  avatar: ""
};

const mutations = {
  RESET_STATE: state => {
    // Object.assign(state, getDefaultState());
    state.token = "";
    state.name = "";
    state.avatar = "";
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    try {
      const re = await login({ username: username.trim(), password: password });
      if (re.code === 20000) {
        commit("SET_TOKEN", re.data.token);
        setToken(re.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  },

  // async getInfo({ commit, state }) {
  //   try {
  //     const re = await getInfo(state.token);
  //     if (!re.data) {
  //       return reject("Verification failed, please Login again.");
  //     }
  //     const { name, avatar } = re.data;

  //     commit("SET_NAME", name);
  //     commit("SET_AVATAR", avatar);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
