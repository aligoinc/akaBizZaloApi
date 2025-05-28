import zaloWebApi from '../apiclients/zaloWebApi.js';

/**
 * Service layer cho các API Zalo Web
 */
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
};

export default zaloService;
