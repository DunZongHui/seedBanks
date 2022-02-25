import request from "@/utils/request";
export default {
  getList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "get"
    });
  },
  remove(id) {
    return request.delete(`/admin/product/deleteAttr/${id}`);
  },
  addOrUpdate(attr) {
    return request.post(`/admin/product/saveAttrInfo`,attr);
  }
};
