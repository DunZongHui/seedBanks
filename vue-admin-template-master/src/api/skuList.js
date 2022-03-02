import request from "@/utils/request";
export default {
  // /admin/product/list/{page}/{limit}
  getList(page, limit) {
    return request({
      url: `/admin/product/list/${page}/${limit}`,
      method: "GET"
    });
  },
  getDrawer(skuId) {
    return request({
      url: `/admin/product/getSkuById/${skuId}`,
      method: "GET"
    });
  },
  remove(skuId) {
    return request({
      url: `/admin/product/deleteSku/${skuId}`,
      method: "DELETE"
    });
  },
  onSale(id) {
    return request.get(`/admin/product/onSale/${id}`);
  },
  cancelSale(id) {
    return request.get(`/admin/product/cancelSale/${id}`);
  }
};
