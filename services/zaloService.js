import { Zalo } from 'zca-js';
import zaloWebApi from '../apiclients/zaloWebApi.js';

/**
 * Service layer cho các API Zalo Web
 */
let GLOBAL_LOGIN_SESSION = {};

const zaloService = {
  async getSecretKey(cookie, imei, enc_ver, apiType, apiVersion, computerName, language) {
    return zaloWebApi.getSecretKey(cookie, imei, enc_ver, apiType, apiVersion, computerName, language);
  },
  async getProfile(cookie, imei, secretKey, id) {
    return zaloWebApi.getProfile(cookie, imei, secretKey, id);
  },
  async sms(cookie, imei, secretKey, id, content) {
    return zaloWebApi.sms(cookie, imei, secretKey, id, content);
  },
  async uploadImage(cookie, imei, secretKey, id, file) {
    return zaloWebApi.uploadImage(cookie, imei, secretKey, id, file);
  },
  async sendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content) {
    return zaloWebApi.sendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
  },
  async groupSendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content) {
    return zaloWebApi.groupSendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
  },
  async addFriend(cookie, imei, secretKey, id, content) {
    return zaloWebApi.addFriend(cookie, imei, secretKey, id, content);
  },
  async removeFriend(cookie, imei, secretKey, id) {
    return zaloWebApi.removeFriend(cookie, imei, secretKey, id);
  },
  async rename(cookie, imei, secretKey, id, newName) {
    return zaloWebApi.rename(cookie, imei, secretKey, id, newName);
  },
  async getFriends(cookie, imei, secretKey) {
    return zaloWebApi.getFriends(cookie, imei, secretKey);
  },
  async getTags(cookie, imei, secretKey) {
    return zaloWebApi.getTags(cookie, imei, secretKey);
  },
  async getReqStatus(cookie, imei, secretKey, id) {
    return zaloWebApi.getReqStatus(cookie, imei, secretKey, id);
  },
  async getGroupIds(cookie, imei, secretKey) {
    return zaloWebApi.getGroupIds(cookie, imei, secretKey);
  },
  async getGroupInfos(cookie, imei, secretKey, ids) {
    return zaloWebApi.getGroupInfos(cookie, imei, secretKey, ids);
  },
  async getGroupMemberIds(cookie, imei, secretKey, id) {
    return zaloWebApi.getGroupMemberIds(cookie, imei, secretKey, id);
  },
  async getGroupMemberInfos(cookie, imei, secretKey, ids) {
    return zaloWebApi.getGroupMemberInfos(cookie, imei, secretKey, ids);
  },
  async leaveGroup(cookie, imei, secretKey, id) {
    return zaloWebApi.leaveGroup(cookie, imei, secretKey, id);
  },
  async createGroup(cookie, imei, secretKey, groupName, contacts) {
    return zaloWebApi.createGroup(cookie, imei, secretKey, groupName, contacts);
  },
  async inviteGroup(cookie, imei, secretKey, id, memberIds) {
    return zaloWebApi.inviteGroup(cookie, imei, secretKey, id, memberIds);
  },
  async groupSendMsg(cookie, imei, secretKey, id, content) {
    return zaloWebApi.groupSendMsg(cookie, imei, secretKey, id, content);
  },
  async shareSms(cookie, imei, secretKey, paramIds, content) {
    return zaloWebApi.shareSms(cookie, imei, secretKey, paramIds, content);
  },
  async quote(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent) {
    return zaloWebApi.quote(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent);
  },
  async quoteGroup(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent) {
    return zaloWebApi.quoteGroup(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent);
  },
  async reactMessage(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType) {
    return zaloWebApi.reactMessage(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType);
  },
  async reactMessageGroup(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType) {
    return zaloWebApi.reactMessageGroup(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType);
  },
  async searchPhone(cookie, imei, secretKey, phone) {
    return zaloWebApi.searchPhone(cookie, imei, secretKey, phone);
  },
  async getSecretKey(cookie, imei, enc_ver, apiType, apiVersion, computerName, language) {
    return zaloWebApi.getSecretKey(cookie, imei, enc_ver, apiType, apiVersion, computerName, language);
  },
  async getProfile(cookie, imei, secretKey, id) {
    return zaloWebApi.getProfile(cookie, imei, secretKey, id);
  },
  async sms(cookie, imei, secretKey, id, content) {
    return zaloWebApi.sms(cookie, imei, secretKey, id, content);
  },
  async uploadImage(cookie, imei, secretKey, id, file) {
    return zaloWebApi.uploadImage(cookie, imei, secretKey, id, file);
  },
  async sendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content) {
    return zaloWebApi.sendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
  },
  async groupSendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content) {
    return zaloWebApi.groupSendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
  },
  async loginQR() {
    return new Promise((resolve, reject) => {
      try {
        const sessionId = Date.now() + "_" + Math.random().toString(36).substring(2, 15);

        const zalo = new Zalo({
          // agent: new HttpsProxyAgent(
          //   `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.portHttp}`
          // ),
          // polyfill: nodefetch,
          selfListen: true, // mặc định false, lắng nghe sự kiện của bản thân
          checkUpdate: true, // mặc định true, kiểm tra update
          logging: true, // mặc định true, bật/tắt log mặc định của thư viện
        });

        // Lưu process login
        GLOBAL_LOGIN_SESSION[sessionId] = {
          status: "waiting",
          data: null,
          timestamp: Date.now()
        };

        // Tạo QR
        zalo.loginQR({
          userAgent: "", // không bắt buộc
          qrPath: "", // đường dẫn lưu QR, mặc định ./qr.png
        }, (qrcode) => {
          // Trả về sessionId và data QR code
          resolve({
            sessionId,
            data: qrcode
          });
        }).then(api => {
          // Khi user quét xong QR và đăng nhập, kết quả trả ra ở đây
          api.fetchAccountInfo().then(user => {
            GLOBAL_LOGIN_SESSION[sessionId].status = "success";
            GLOBAL_LOGIN_SESSION[sessionId].data = { ctx: api.getContext(), user };
          });
        }).catch(err => {
          GLOBAL_LOGIN_SESSION[sessionId].status = "error";
          GLOBAL_LOGIN_SESSION[sessionId].error = "QR code đã hết hạn";
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  async getLoginInfo(sessionId) {
    try {
      const session = GLOBAL_LOGIN_SESSION[sessionId];
      if (!session) {
        return {
          status: -1,
          message: "Session không tồn tại hoặc đã hết hạn"
        };
      }

      const { status, data, error, timestamp } = session;
      
      // Check if QR code is expired (after 2 minutes)
      const now = Date.now();
      const expirationTime = 2 * 60 * 1000; // 2 minutes in milliseconds
      
      if (now - timestamp > expirationTime && status === "waiting") {
        delete GLOBAL_LOGIN_SESSION[sessionId];
        return {
          status: -1,
          message: "QR code đã hết hạn"
        };
      }

      // Return appropriate response based on status
      if (status === "waiting") {
        return {
          status: 0,
          message: "Đang chờ quét QR"
        };
      } else if (status === "success") {
        // Clean up session data after successful retrieval
        delete GLOBAL_LOGIN_SESSION[sessionId];
        return {
          status: 1,
          data: data
        };
      } else if (status === "error") {
        // Clean up session data after error retrieval
        delete GLOBAL_LOGIN_SESSION[sessionId];
        return {
          status: -2,
          message: error
        };
      }
    } catch (error) {
      return {
        status: -2,
        message: error.message
      };
    }
  },
};

export default zaloService;
