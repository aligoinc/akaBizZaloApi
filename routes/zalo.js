import express from 'express';
import zaloController from '../controllers/zaloController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * /zalo/get-profile:
 *   post:
 *     summary: Lấy profile người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-profile', zaloController.getProfile);

/**
 * @swagger
 * /zalo/sms:
 *   post:
 *     summary: Gửi tin nhắn SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/sms', zaloController.sms);

/**
 * @swagger
 * /zalo/upload-image:
 *   post:
 *     summary: Upload ảnh (dùng multipart/form-data)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/upload-image', upload.single('file'), zaloController.uploadImage);

/**
 * @swagger
 * /zalo/send-image:
 *   post:
 *     summary: Gửi ảnh cá nhân
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/send-image', zaloController.sendImage);

/**
 * @swagger
 * /zalo/group-send-image:
 *   post:
 *     summary: Gửi ảnh vào group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/group-send-image', zaloController.groupSendImage);

/**
 * @swagger
 * /zalo/add-friend:
 *   post:
 *     summary: Kết bạn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/add-friend', zaloController.addFriend);

/**
 * @swagger
 * /zalo/remove-friend:
 *   post:
 *     summary: Hủy kết bạn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/remove-friend', zaloController.removeFriend);

/**
 * @swagger
 * /zalo/rename:
 *   post:
 *     summary: Đổi tên bạn bè
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/rename', zaloController.rename);

/**
 * @swagger
 * /zalo/get-friends:
 *   post:
 *     summary: Lấy danh sách bạn bè
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-friends', zaloController.getFriends);

/**
 * @swagger
 * /zalo/get-tags:
 *   post:
 *     summary: Lấy danh sách tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-tags', zaloController.getTags);

/**
 * @swagger
 * /zalo/get-req-status:
 *   post:
 *     summary: Lấy trạng thái kết bạn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-req-status', zaloController.getReqStatus);

/**
 * @swagger
 * /zalo/get-group-ids:
 *   post:
 *     summary: Lấy danh sách group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-group-ids', zaloController.getGroupIds);

/**
 * @swagger
 * /zalo/get-group-infos:
 *   post:
 *     summary: Lấy thông tin các group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-group-infos', zaloController.getGroupInfos);

/**
 * @swagger
 * /zalo/get-group-member-ids:
 *   post:
 *     summary: Lấy danh sách thành viên nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-group-member-ids', zaloController.getGroupMemberIds);

/**
 * @swagger
 * /zalo/get-group-member-infos:
 *   post:
 *     summary: Lấy thông tin thành viên nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/get-group-member-infos', zaloController.getGroupMemberInfos);

/**
 * @swagger
 * /zalo/leave-group:
 *   post:
 *     summary: Rời nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/leave-group', zaloController.leaveGroup);

/**
 * @swagger
 * /zalo/create-group:
 *   post:
 *     summary: Tạo nhóm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               groupName:
 *                 type: string
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/create-group', zaloController.createGroup);

/**
 * @swagger
 * /zalo/invite-group:
 *   post:
 *     summary: Mời thành viên vào nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/invite-group', zaloController.inviteGroup);

/**
 * @swagger
 * /zalo/group-send-msg:
 *   post:
 *     summary: Gửi tin nhắn vào group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/group-send-msg', zaloController.groupSendMsg);

/**
 * @swagger
 * /zalo/share-sms:
 *   post:
 *     summary: Chia sẻ SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               paramIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/share-sms', zaloController.shareSms);

/**
 * @swagger
 * /zalo/quote:
 *   post:
 *     summary: Trích dẫn tin nhắn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               msgId:
 *                 type: string
 *               cliMsgId:
 *                 type: string
 *               type:
 *                 type: string
 *               msgTs:
 *                 type: string
 *               msgContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/quote', zaloController.quote);

/**
 * @swagger
 * /zalo/quote-group:
 *   post:
 *     summary: Trích dẫn tin nhắn nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               msgId:
 *                 type: string
 *               cliMsgId:
 *                 type: string
 *               type:
 *                 type: string
 *               msgTs:
 *                 type: string
 *               msgContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/quote-group', zaloController.quoteGroup);

/**
 * @swagger
 * /zalo/react-message:
 *   post:
 *     summary: React tin nhắn cá nhân
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               msgId:
 *                 type: string
 *               cliMsgId:
 *                 type: string
 *               type:
 *                 type: string
 *               rIcon:
 *                 type: string
 *               rType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/react-message', zaloController.reactMessage);

/**
 * @swagger
 * /zalo/react-message-group:
 *   post:
 *     summary: React tin nhắn nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               id:
 *                 type: string
 *               msgId:
 *                 type: string
 *               cliMsgId:
 *                 type: string
 *               type:
 *                 type: string
 *               rIcon:
 *                 type: string
 *               rType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/react-message-group', zaloController.reactMessageGroup);

/**
 * @swagger
 * /zalo/search-phone:
 *   post:
 *     summary: Tìm kiếm số điện thoại
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cookie:
 *                 type: string
 *               imei:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/search-phone', zaloController.searchPhone);

export default router;
