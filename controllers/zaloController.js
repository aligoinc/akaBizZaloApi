import zaloService from '../services/zaloService.js';

/**
 * Controller layer cho các API Zalo Web
 */
const zaloController = {
  async addFriend(req, res) {
    try {
      const { cookie, imei, secretKey, id, content } = req.body;
      const result = await zaloService.addFriend(cookie, imei, secretKey, id, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async removeFriend(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const result = await zaloService.removeFriend(cookie, imei, secretKey, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async rename(req, res) {
    try {
      const { cookie, imei, secretKey, id, newName } = req.body;
      const result = await zaloService.rename(cookie, imei, secretKey, id, newName);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getFriends(req, res) {
    try {
      const { cookie, imei, secretKey } = req.body;
      const result = await zaloService.getFriends(cookie, imei, secretKey);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getTags(req, res) {
    try {
      const { cookie, imei, secretKey } = req.body;
      const result = await zaloService.getTags(cookie, imei, secretKey);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getReqStatus(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const result = await zaloService.getReqStatus(cookie, imei, secretKey, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGroupIds(req, res) {
    try {
      const { cookie, imei, secretKey } = req.body;
      const result = await zaloService.getGroupIds(cookie, imei, secretKey);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGroupInfos(req, res) {
    try {
      const { cookie, imei, secretKey, ids } = req.body;
      const result = await zaloService.getGroupInfos(cookie, imei, secretKey, ids);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGroupMemberIds(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const result = await zaloService.getGroupMemberIds(cookie, imei, secretKey, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGroupMemberInfos(req, res) {
    try {
      const { cookie, imei, secretKey, ids } = req.body;
      const result = await zaloService.getGroupMemberInfos(cookie, imei, secretKey, ids);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async leaveGroup(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const result = await zaloService.leaveGroup(cookie, imei, secretKey, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createGroup(req, res) {
    try {
      const { cookie, imei, secretKey, groupName, contacts } = req.body;
      const result = await zaloService.createGroup(cookie, imei, secretKey, groupName, contacts);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async inviteGroup(req, res) {
    try {
      const { cookie, imei, secretKey, id, memberIds } = req.body;
      const result = await zaloService.inviteGroup(cookie, imei, secretKey, id, memberIds);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async groupSendMsg(req, res) {
    try {
      const { cookie, imei, secretKey, id, content } = req.body;
      const result = await zaloService.groupSendMsg(cookie, imei, secretKey, id, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async shareSms(req, res) {
    try {
      const { cookie, imei, secretKey, paramIds, content } = req.body;
      const result = await zaloService.shareSms(cookie, imei, secretKey, paramIds, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async quote(req, res) {
    try {
      const { cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent } = req.body;
      const result = await zaloService.quote(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async quoteGroup(req, res) {
    try {
      const { cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent } = req.body;
      const result = await zaloService.quoteGroup(cookie, imei, secretKey, id, content, ownerId, msgId, cliMsgId, type, msgTs, msgContent);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async reactMessage(req, res) {
    try {
      const { cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType } = req.body;
      const result = await zaloService.reactMessage(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async reactMessageGroup(req, res) {
    try {
      const { cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType } = req.body;
      const result = await zaloService.reactMessageGroup(cookie, imei, secretKey, id, msgId, cliMsgId, type, rIcon, rType);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async searchPhone(req, res) {
    try {
      const { cookie, imei, secretKey, phone } = req.body;
      const result = await zaloService.searchPhone(cookie, imei, secretKey, phone);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getProfile(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const result = await zaloService.getProfile(cookie, imei, secretKey, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async sms(req, res) {
    try {
      const { cookie, imei, secretKey, id, content } = req.body;
      const result = await zaloService.sms(cookie, imei, secretKey, id, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async uploadImage(req, res) {
    try {
      const { cookie, imei, secretKey, id } = req.body;
      const file = req.file;
      const result = await zaloService.uploadImage(cookie, imei, secretKey, id, file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async sendImage(req, res) {
    try {
      const { cookie, imei, secretKey, id, imgUrl, imgInfo, content } = req.body;
      const result = await zaloService.sendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async groupSendImage(req, res) {
    try {
      const { cookie, imei, secretKey, id, imgUrl, imgInfo, content } = req.body;
      const result = await zaloService.groupSendImage(cookie, imei, secretKey, id, imgUrl, imgInfo, content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default zaloController;
