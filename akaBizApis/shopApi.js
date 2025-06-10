import akaBizAxiosClient from "./akaBizAxiosClient.js";

const shopApi = {
  getZaloApiShops: () => {
    const url = `/api/Shop/getZaloApiShops`;
    return akaBizAxiosClient.get(url);
  },
  getShopsByTypes: (staffId, shopTypes) => {
    const url = `/api/Shop/get?staffId=${staffId}&shopTypes=${shopTypes}`;
    return akaBizAxiosClient.get(url);
  },
  addShop: (shop) => {
    const url = `/api/Shop/addZaloShop`;
    return akaBizAxiosClient.post(url, shop);
  },
  getShopContacts: (shopId, type, parentId = "") => {
    const url = `/api/ShopContact/getShopContacts?shopId=${shopId}&type=${type}&parentId=${parentId}`;
    return akaBizAxiosClient.get(url);
  },
  getTags: (staffId) => {
    const url = `/api/ShopContact/getTagsZaloByStaffId?staffId=${staffId}`;
    return akaBizAxiosClient.get(url);
  },
  deleteShop: (shopId) => {
    const url = `/api/Campaign/deleteShop?shopId=${shopId}`;
    return akaBizAxiosClient.patch(url);
  },
  generateKeyApi: (shopId) => {
    const url = `/api/Shop/generateKeyApi?shopId=${shopId}`;
    return akaBizAxiosClient.post(url);
  },
  getInfoUid: (data) => {
    const url = `/api/ApiCall/zaloGetInfoUid`;
    return akaBizAxiosClient.post(url, data);
  },
};

export default shopApi;
