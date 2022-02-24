import request from "@/utils/request";
export default {
  remove(id) {
    //删除数据
    return request({
      url: `/admin/product/baseTrademark/remove/${id}`,
      method: "delete"
    });
  },
  addOrUpdata(trademark) {
    //添加或修改
    if (!trademark.id) {
      return request({
        url: `/admin/product/baseTrademark/save`,
        method: "post",
        data: trademark
      });
    } else {
      return request({
        url: `/admin/product/baseTrademark/update`,
        method: "put",
        data: trademark
      });
    }
  },
  
  getPageList(page, limit) {//当前码，每页数量 
    return request({
      url: `/admin/product/baseTrademark/${page}/${limit}`,
      method: "get"
    });
  }
};
