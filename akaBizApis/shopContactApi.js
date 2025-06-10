import { AKABIZ_API_URL } from "../constants/urlConstant.js";

const ShopContactApi = {
  addShopContacts: (shopId, shopContacts, type, parentId = null) => {
    const url = `${AKABIZ_API_URL}/api/ShopContact/addShopContacts`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopId: shopId,
        shopContactViews: shopContacts,
        type: type,
        parentId: parentId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getShopContacts: (shopId, type) => {
    const url = `${AKABIZ_API_URL}/api/ShopContact/getShopContacts?shopId=${shopId}&type=${type}`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  checkHasShopContact: (shopId) => {
    const url = `${AKABIZ_API_URL}/api/ShopContact/checkHasShopContact?shopId=${shopId}`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
};

export default ShopContactApi;
