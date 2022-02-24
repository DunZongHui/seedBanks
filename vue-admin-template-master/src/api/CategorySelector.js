import request from "@/utils/request";
export default {
  getCategory1() {
    return request({
      url: `/admin/product/getCategory1`,
      method: "get"
    });
  },
  getCategory2(category1Id) {
    return request({
      url: `/admin/product/getCategory2/${category1Id}`,
      method: "get"
    });
  },
  getCategory3(category2Id) {
    return request({
      url: `/admin/product/getCategory3/${category2Id}`,
      method: "get"
    });
  }
};
