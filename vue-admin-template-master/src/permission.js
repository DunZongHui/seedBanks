import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);
  // determine whether the user has logged in
  const hasToken = store.getters.token;
  if (hasToken) {
    //存在toke
    if (to.path === "/login") {
      // 前往登录页，如果已登录，则重定向到主页
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next(); //存在用户信息放行
      } else {
        try {
          // get user info 从新获取用户信息
          await store.dispatch("user/getInfo");
          next({ ...to });
          // next()
        } catch (error) {
          //获取用户信息失败，删除token，进入登录页面重新登录
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* 不存在token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly去往白名单包含的页面放行
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`); //前往登录页面，并记录需要前往的页面
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
