import { AKABIZ_API_URL } from "../constants/urlConstant.js";

const campaignApi = {
  getCampaigns: (shopId) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/getCampaignsCanStartByShopId?shopId=${shopId}`;

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
  getCampaignDetails: (campaignId) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/getCampaignDetailByCampaignId?campaignId=${campaignId}`;

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
  changeScheduleCampaign: (camp) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/changeScheduleCampaign`;
    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camp),
    }).catch((error) => {
      // Xử lý lỗi ở đây nếu cần
      console.error("Fetch error:", error);
      throw error;
    });
  },
  changeStatusCampaign: (campaignId, status) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/changeStatusCampaign?campaignId=${campaignId}&status=${status}`;
    return fetch(url, { method: "PATCH" }).catch((error) => {
      // Xử lý lỗi ở đây nếu cần
      console.error("Fetch error:", error);
      throw error;
    });
  },
  changeStatusCampaignDetail: (campaignDetailId, status, note) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/changeStatusCampaignDetail?campaignDetailId=${campaignDetailId}&status=${status}&note=${note}`;
    return fetch(url, { method: "PATCH" }).catch((error) => {
      // Xử lý lỗi ở đây nếu cần
      console.error("Fetch error:", error);
      throw error;
    });
  },
  changeStatusCampaignDetail2: (campDetail) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/changeStatusCampaignDetail2`;
    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campDetail),
    }).catch((error) => {
      // Xử lý lỗi ở đây nếu cần
      console.error("Fetch error:", error);
      throw error;
    });
  },
  addCampaignDetailAction: (detailAction) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/addCampaignDetailAction`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detailAction),
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
  addCampaignDetail: (campaignDetail) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/addCampaignDetail`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignDetail),
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
  addDetailToSendSms: (detail) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/addDetailToSendSms`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detail),
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
  checkUidFrequencyLimit: (
    uid,
    phone,
    campaignActionId,
    shopId,
    frequencyLimit
  ) => {
    const url = `${AKABIZ_API_URL}/api/Campaign/checkUidFrequencyLimit_ByShopId?uid=${uid}&phone=${phone}&campaignActionId=${campaignActionId}&shopId=${shopId}&frequencyLimit=${frequencyLimit}`;

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

export default campaignApi;
