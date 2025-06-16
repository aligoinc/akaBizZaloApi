import campaignApi from "../akaBizApis/campaignApi.js";
import shopApi from "../akaBizApis/shopApi.js";
import {
  getInfoImageFromUrl,
  getRandomArray,
  replaceVocative,
  sleep,
  urlToBlob,
} from "../utils/common.js";
import { Zalo } from "zca-js";
import {
  ADD_MEMBER_TO_GROUP,
  SEND_TO_FRIEND,
  SEND_TO_GROUP,
  SEND_TO_GROUP_MEMBER,
  SEND_TO_PHONE,
} from "../constants/campaignActionContant.js";
import zaloWebApi from "../apiclients/zaloWebApi.js";
import { getUidFromAvatarLink } from "../utils/zaloAction.js";
import { FriendStatusConstant } from "../constants/friendStatusConstant.js";
import { DetailStatusConstant } from "../constants/detailStatusConstant.js";

let shops = [];

const start = async () => {
  const runningShopIds = [];
  while (true) {
    try {
      const resGetShop = await shopApi.getZaloApiShops();
      if (resGetShop.status === 1) {
        shops = resGetShop.data;
      }
      for (let shop of shops) {
        if (
          !runningShopIds.includes(shop.id) &&
          shop.zaloLoginData &&
          shop.accountId !== 809
        ) {
          (async () => {
            runningShopIds.push(shop.id);
            await runCampaign(shop);
            if (runningShopIds.indexOf(shop.id) != -1) {
              runningShopIds.splice(runningShopIds.indexOf(shop.id), 1);
            }
          })();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      await sleep(20000);
    }
  }
};

const runCampaign = async (shop) => {
  try {
    const resGetCampaign = await campaignApi.getCampaigns(shop.id);
    if (resGetCampaign.status === 1) {
      const campaign = resGetCampaign.data.runningCampaign;
      if (campaign && campaign?.isSendByZaloWebApi) {
        const zalo = new Zalo({
          // agent: new HttpsProxyAgent(
          //   `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.portHttp}`
          // ),
          // polyfill: nodefetch,
          selfListen: true, // mặc định false, lắng nghe sự kiện của bản thân
          checkUpdate: true, // mặc định true, kiểm tra update
          logging: true, // mặc định true, bật/tắt log mặc định của thư viện
        });
        const api = await zalo.login(JSON.parse(shop.zaloLoginData));
        let countProcessed = 0;
        let isLimitSearchPhone = false;
        if (campaign.campaignActionId === SEND_TO_PHONE) {
          let contents = (campaign.contentMessage ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contents.length == 0) contents.push("");
          let iContent = 0;

          let contentAddFriends = (campaign.contentAddFriend ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contentAddFriends.length == 0) contentAddFriends.push("");
          let iContentAddFriend = 0;

          let contentSmses = (campaign.contentSms ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contentSmses.length == 0) contentSmses.push("");
          let iContentSms = 0;
          for (let i = 0; i < campaign.details.length; i++) {
            try {
              // Kiểm tra giới hạn gửi trong ngày
              if (
                countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                countProcessed >= (campaign.countSendingOfHour ?? 9)
              )
                break;
              // kiểm tra tần suất gửi
              if (
                !campaign.isNotFrequencyLimit &&
                (
                  await campaignApi.checkUidFrequencyLimit(
                    "",
                    campaign.details[i].phone,
                    SEND_TO_PHONE,
                    campaign.shopId,
                    campaign.frequencyLimit ?? 0
                  )
                ).status == 1
              ) {
                // Cập nhật trạng thái detail
                await campaignApi.changeStatusCampaignDetail(
                  campaign.details[i].id,
                  0,
                  "Đã gửi tin trước đó"
                );

                //   addNote(
                //     `${getDateTimeNow()} - Inbox/Kết bạn đến SĐT ${
                //       campaign.details[i].phone
                //     } - Đã gửi tin trước đó`
                //   );
                await sleep(1000);
                continue;
              }

              let content = contents[iContent]
                .replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "");
              let contentAddFriend = contentAddFriends[iContentAddFriend]
                .replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "");
              let nameToChange = campaign.nameToChange
                ?.replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "")
                .trim();
              let contentSms = contentSmses[iContentSms]
                ?.replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "")
                .trim();

              // Thực hiện gửi tin nhắn/kết bạn
              let resSendToPhone = await sendToPhone(
                api,
                shop.zaloCookies,
                shop.zaloImei,
                shop.zaloSecretKey,
                campaign.shopId,
                campaign.isSendBySearchName,
                campaign.details[i].phone,
                //campaign.details[i].groupUserId,
                null,
                campaign.isSendMessage,
                campaign.isAddFriend,
                content,
                campaign.isContentAI,
                campaign.media,
                campaign.isSendFolderMedia,
                campaign.isRandomFolderMedia,
                campaign.countRandomFolderMedia,
                contentAddFriend,
                campaign.isAddTag,
                campaign.tagName,
                campaign.isRename,
                nameToChange,
                contentSms
              );
              if (resSendToPhone.status == 1) {
                isLimitSearchPhone = true;
                break;
              }

              iContent++;
              if (iContent >= contents.length) iContent = 0;
              iContentAddFriend++;
              if (iContentAddFriend >= contentAddFriends.length)
                iContentAddFriend = 0;
              if (resSendToPhone.contentSms)
                contentSms = resSendToPhone.contentSms;
              if (campaign.isSendSms && campaign.details[i].phone?.trim()) {
                let statusesToSendSms = campaign.statusesToSendSms
                  ?.split(",")
                  .filter((x) => x.trim())
                  .map((x) => parseInt(x));
                let shopIdsSendSms = campaign.shopIdsSendSms
                  ?.split(",")
                  .filter((x) => x.trim());
                if (
                  shopIdsSendSms &&
                  statusesToSendSms.includes(resSendToPhone.status)
                ) {
                  for (
                    let iShopIdSendSms = 0;
                    iShopIdSendSms < shopIdsSendSms.length;
                    iShopIdSendSms++
                  ) {
                    await campaignApi.addDetailToSendSms({
                      shopId: shopIdsSendSms[iShopIdSendSms],
                      campaignId: campaign.id,
                      phone: campaign.details[i].phone,
                      content: replaceVocative(
                        contentSms.replaceAll("[fullname_web]", ""),
                        ""
                      ),
                    });
                  }
                  iContentSms++;
                  if (iContentSms >= contentSmses.length) iContentSms = 0;
                }
              }

              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail2({
                id: campaign.details[i].id,
                status: resSendToPhone.status,
                errorMessage: resSendToPhone.message,
                contentMessage: resSendToPhone.content?.slice(0, 4000) ?? "",
                name: resSendToPhone.info?.name ?? null,
                uid: resSendToPhone.info?.uid ?? null,
                groupUserId: resSendToPhone.info?.zid ?? null,
                postLink: resSendToPhone.info?.avatarLink ?? null,
                friendStatus: resSendToPhone.info?.friendStatus ?? null,
              });

              // addNote(
              //   `${getDateTimeNow()} - Inbox/Kết bạn đến SĐT ${
              //     campaign.details[i].phone
              //   } - ${resSendToPhone.message}`
              // );
              countProcessed++;
              await sleep(campaign.timeSleepBetween2 * 1000);
            } catch (e) {
              console.log("Lỗi khi Inbox/Kết bạn đến SĐT: ", e);
              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail(
                campaign.details[i].id,
                10,
                "Có lỗi xảy ra"
              );

              // addNote(
              //   `${getDateTimeNow()} - Inbox/Kết bạn đến SĐT ${
              //     campaign.details[i].phone
              //   } - Thất bại - Có lỗi xảy ra`
              // );
              await sleep(campaign.timeSleepBetween2 * 1000);
            }
          }
        } else if (campaign.campaignActionId === SEND_TO_FRIEND) {
          let contents = (campaign.contentMessage ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contents.length == 0) contents.push("");
          let iContent = 0;

          if (campaign.isSendByShareMethod) {
            let paramIds = [];
            for (let i = 0; i < campaign.details.length; i++) {
              try {
                paramIds.push({
                  key: i,
                  data: {
                    clientId: Date.now(),
                    toUid: campaign.details[i].groupUserId,
                    ttl: 0,
                  },
                });
                await sleep(1 + Math.floor(Math.random() * 10));
                // Thực hiện gửi tin nhắn
                if (paramIds.length == 50 || i == campaign.details.length - 1) {
                  let resSendToFriend = await sendToFriendByShareApi(
                    api,
                    shop.zaloCookies,
                    shop.zaloImei,
                    shop.zaloSecretKey,
                    campaign.shopId,
                    paramIds.map((x) => x.data),
                    contents[0],
                    campaign.isContentAI,
                    campaign.media,
                    campaign.isSendFolderMedia,
                    campaign.isRandomFolderMedia,
                    campaign.countRandomFolderMedia
                  );

                  // addNote(
                  //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
                  //     resSendToFriend.message
                  //   }`
                  // );

                  if (resSendToFriend.status == 2) {
                    const success = resSendToFriend.resApi?.data?.success ?? [];
                    const fail = resSendToFriend.resApi?.data?.fail ?? [];
                    for (let j = 0; j < success.length; j++) {
                      const pr = paramIds.find(
                        (pr) => pr.data.clientId == success[j].clientId
                      );
                      if (pr) {
                        // Cập nhật trạng thái detail
                        await campaignApi.changeStatusCampaignDetail2({
                          id: campaign.details[pr.key].id,
                          status: 2,
                          errorMessage: "Thành công",
                          contentMessage: "",
                          name: campaign.details[pr.key].name ?? null,
                          uid: campaign.details[pr.key].uid ?? null,
                        });
                      }
                    }
                    for (let j = 0; j < fail.length; j++) {
                      const pr = paramIds.find(
                        (pr) => pr.data.clientId == fail[j].clientId
                      );
                      if (pr) {
                        // Cập nhật trạng thái detail
                        await campaignApi.changeStatusCampaignDetail2({
                          id: campaign.details[pr.key].id,
                          status: 10,
                          errorMessage: "Thất bại",
                          contentMessage: "",
                          name: campaign.details[pr.key].name ?? null,
                          uid: campaign.details[pr.key].uid ?? null,
                        });
                      }
                    }
                  } else {
                    for (let j = 0; j < paramIds.length; j++) {
                      // Cập nhật trạng thái detail
                      await campaignApi.changeStatusCampaignDetail2({
                        id: campaign.details[paramIds[j].key].id,
                        status: 10,
                        errorMessage: "Thất bại",
                        contentMessage: "",
                        name: campaign.details[paramIds[j].key].name ?? null,
                        uid: campaign.details[paramIds[j].key].uid ?? null,
                      });
                    }
                  }
                  paramIds = [];
                  countProcessed++;
                }
              } catch (e) {
                console.log("Lỗi khi Inbox đến bạn bè: ", e);
                // addNote(
                //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
                //     campaign.details[i].name
                //   } - Thất bại - Có lỗi xảy ra`
                // );
              } finally {
                if (paramIds.length >= 50) paramIds = [];
              }
            }
          } else {
            for (let i = 0; i < campaign.details.length; i++) {
              try {
                // Kiểm tra giới hạn gửi trong ngày
                if (
                  countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                  countProcessed >= (campaign.countSendingOfHour ?? 9)
                )
                  break;
                // kiểm tra tần suất gửi
                if (
                  !campaign.isNotFrequencyLimit &&
                  (
                    await campaignApi.checkUidFrequencyLimit(
                      campaign.details[i].uid,
                      "",
                      SEND_TO_FRIEND,
                      campaign.shopId,
                      campaign.frequencyLimit ?? 0
                    )
                  ).status == 1
                ) {
                  // Cập nhật trạng thái detail
                  await campaignApi.changeStatusCampaignDetail(
                    campaign.details[i].id,
                    0,
                    "Đã gửi tin trước đó"
                  );

                  // addNote(
                  //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
                  //     campaign.details[i].name
                  //   } - Đã gửi tin trước đó`
                  // );
                  await sleep(1000);
                  continue;
                }

                let content = contents[iContent]
                  .replaceAll("[fullname]", campaign.details[i].name ?? "")
                  .replaceAll("[phone]", campaign.details[i].phone ?? "")
                  .replaceAll("[email]", campaign.details[i].email ?? "")
                  .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                  .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                  .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                  .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                  .replaceAll("[info5]", campaign.details[i].info5 ?? "");

                // Thực hiện gửi tin nhắn
                let resSendToFriend = await sendToFriend(
                  api,
                  shop.zaloCookies,
                  shop.zaloImei,
                  shop.zaloSecretKey,
                  campaign.shopId,
                  campaign.details[i].groupUserId,
                  content,
                  campaign.isContentAI,
                  campaign.media,
                  campaign.isSendFolderMedia,
                  campaign.isRandomFolderMedia,
                  campaign.countRandomFolderMedia,
                  campaign.isAddTag,
                  campaign.tagName
                );
                iContent++;
                if (iContent >= contents.length) iContent = 0;

                // Cập nhật trạng thái detail
                await campaignApi.changeStatusCampaignDetail2({
                  id: campaign.details[i].id,
                  status: resSendToFriend.status,
                  errorMessage: resSendToFriend.message,
                  contentMessage: resSendToFriend.content?.slice(0, 4000) ?? "",
                  name: resSendToFriend.info?.name ?? null,
                  uid: resSendToFriend.info?.uid ?? null,
                  postLink: resSendToFriend.info?.avatarLink ?? null,
                  friendStatus: resSendToFriend.info?.friendStatus ?? null,
                });

                // addNote(
                //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
                //     campaign.details[i].name
                //   } - ${resSendToFriend.message}`
                // );
                countProcessed++;
                await sleep(campaign.timeSleepBetween2 * 1000);
              } catch (e) {
                console.log("Lỗi khi Inbox đến bạn bè: ", e);
                // Cập nhật trạng thái detail
                await campaignApi.changeStatusCampaignDetail(
                  campaign.details[i].id,
                  10,
                  "Có lỗi xảy ra"
                );

                // addNote(
                //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
                //     campaign.details[i].name
                //   } - Thất bại - Có lỗi xảy ra`
                // );
                await sleep(campaign.timeSleepBetween2 * 1000);
              }
            }
          }
        } else if (campaign.campaignActionId === SEND_TO_GROUP_MEMBER) {
          let contents = (campaign.contentMessage ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contents.length == 0) contents.push("");
          let iContent = 0;

          let contentAddFriends = (campaign.contentAddFriend ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contentAddFriends.length == 0) contentAddFriends.push("");
          let iContentAddFriend = 0;

          for (let i = 0; i < campaign.details.length; i++) {
            try {
              // Kiểm tra giới hạn gửi trong ngày
              if (
                countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                countProcessed >= (campaign.countSendingOfHour ?? 9)
              )
                break;
              // kiểm tra tần suất gửi
              if (
                !campaign.isNotFrequencyLimit &&
                (
                  await campaignApi.checkUidFrequencyLimit(
                    campaign.details[i].uid,
                    "",
                    SEND_TO_GROUP_MEMBER,
                    campaign.shopId,
                    campaign.frequencyLimit ?? 0
                  )
                ).status == 1
              ) {
                // Cập nhật trạng thái detail
                await campaignApi.changeStatusCampaignDetail(
                  campaign.details[i].id,
                  0,
                  "Đã gửi tin trước đó"
                );

                //   addNote(
                //     `${getDateTimeNow()} - Inbox/Kết bạn đến SĐT ${
                //       campaign.details[i].phone
                //     } - Đã gửi tin trước đó`
                //   );
                await sleep(1000);
                continue;
              }

              let content = contents[iContent]
                .replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "");
              let contentAddFriend = contentAddFriends[iContentAddFriend]
                .replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "");

              // Thực hiện gửi tin nhắn/kết bạn
              let resSendToPhone = await sendToGroupMember(
                api,
                shop.zaloCookies,
                shop.zaloImei,
                shop.zaloSecretKey,
                campaign.shopId,
                campaign.details[i].groupUserId,
                campaign.isSendMessage,
                campaign.isAddFriend,
                content,
                campaign.isContentAI,
                campaign.media,
                campaign.isSendFolderMedia,
                campaign.isRandomFolderMedia,
                campaign.countRandomFolderMedia,
                contentAddFriend,
                campaign.isAddTag,
                campaign.tagName
              );

              iContent++;
              if (iContent >= contents.length) iContent = 0;
              iContentAddFriend++;
              if (iContentAddFriend >= contentAddFriends.length)
                iContentAddFriend = 0;

              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail2({
                id: campaign.details[i].id,
                status: resSendToPhone.status,
                errorMessage: resSendToPhone.message,
                contentMessage: resSendToPhone.content?.slice(0, 4000) ?? "",
                name: resSendToPhone.info?.name ?? null,
                uid: resSendToPhone.info?.uid ?? null,
                groupUserId: resSendToPhone.info?.zid ?? null,
                postLink: resSendToPhone.info?.avatarLink ?? null,
                friendStatus: resSendToPhone.info?.friendStatus ?? null,
              });

              // addNote(
              //   `${getDateTimeNow()} - Inbox/Kết bạn đến thành viên group ${
              //     campaign.details[i].name
              //   } - ${resSendToPhone.message}`
              // );
              countProcessed++;
              await sleep(campaign.timeSleepBetween2 * 1000);
            } catch (e) {
              console.log("Lỗi khi Inbox/Kết bạn đến SĐT: ", e);
              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail(
                campaign.details[i].id,
                10,
                "Có lỗi xảy ra"
              );

              // addNote(
              //   `${getDateTimeNow()} - Inbox/Kết bạn đến thành viên group ${
              //     campaign.details[i].name
              //   } - Thất bại - Có lỗi xảy ra`
              // );
              await sleep(campaign.timeSleepBetween2 * 1000);
            }
          }
        } else if (campaign.campaignActionId === SEND_TO_GROUP) {
          let contents = (campaign.contentMessage ?? "")
            .split("|")
            .map((content) => content.trim())
            .filter((content) => content);
          if (contents.length == 0) contents.push("");
          let iContent = 0;

          for (let i = 0; i < campaign.details.length; i++) {
            try {
              // Kiểm tra giới hạn gửi trong ngày
              if (
                countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                countProcessed >= (campaign.countSendingOfHour ?? 9)
              )
                break;

              let content = contents[iContent]
                .replaceAll("[fullname]", campaign.details[i].name ?? "")
                .replaceAll("[phone]", campaign.details[i].phone ?? "")
                .replaceAll("[email]", campaign.details[i].email ?? "")
                .replaceAll("[info1]", campaign.details[i].info1 ?? "")
                .replaceAll("[info2]", campaign.details[i].info2 ?? "")
                .replaceAll("[info3]", campaign.details[i].info3 ?? "")
                .replaceAll("[info4]", campaign.details[i].info4 ?? "")
                .replaceAll("[info5]", campaign.details[i].info5 ?? "");

              // Thực hiện gửi tin nhắn
              let resSendToGroup = await sendToGroup(
                api,
                shop.zaloCookies,
                shop.zaloImei,
                shop.zaloSecretKey,
                campaign.shopId,
                campaign.details[i].name,
                campaign.details[i].groupUserId?.replace("g", ""),
                content,
                campaign.isContentAI,
                campaign.media,
                campaign.isSendFolderMedia,
                campaign.isRandomFolderMedia,
                campaign.countRandomFolderMedia
              );
              iContent++;
              if (iContent >= contents.length) iContent = 0;

              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail2({
                id: campaign.details[i].id,
                status: resSendToGroup.status,
                errorMessage: resSendToGroup.message,
                contentMessage: resSendToGroup.content?.slice(0, 4000) ?? "",
                name: resSendToGroup.info?.name ?? null,
              });

              // addNote(
              //   `${getDateTimeNow()} - Inbox đến bạn bè - ${
              //     campaign.details[i].name
              //   } - ${resSendToFriend.message}`
              // );
              countProcessed++;
              await sleep(campaign.timeSleepBetween2 * 1000);
            } catch (e) {
              console.log("Lỗi khi Inbox đến group: ", e);
              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail(
                campaign.details[i].id,
                10,
                "Có lỗi xảy ra"
              );

              // addNote(
              //   `${getDateTimeNow()} - Inbox đến group - ${
              //     campaign.details[i].name
              //   } - Thất bại - Có lỗi xảy ra`
              // );
              await sleep(campaign.timeSleepBetween2 * 1000);
            }
          }
        } else if (campaign.campaignActionId === ADD_MEMBER_TO_GROUP) {
          let maxSelect = 50;
          let addGroupDetails = [];
          for (let i = 0; i < campaign.details.length; i++) {
            try {
              // Kiểm tra giới hạn gửi trong ngày
              if (
                countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                countProcessed >= (campaign.countSendingOfHour ?? 9) ||
                addGroupDetails.length === maxSelect ||
                i == campaign.details.length - 1
              ) {
                if (i == campaign.details.length - 1)
                  addGroupDetails.push({
                    id: campaign.details[i].id,
                    phone: campaign.details[i].phone,
                    zid: campaign.details[i].groupUserId,
                  });
                let resAddMemberToGroups = await addMembersToGroup(
                  api,
                  shop.zaloCookies,
                  shop.zaloImei,
                  shop.zaloSecretKey,
                  campaign.shopId,
                  campaign.shopContactName?.replace("g", ""),
                  addGroupDetails,
                  campaign.timeSleepBetween2
                );
                for (const resDetail of resAddMemberToGroups.resDetails) {
                  if (resDetail.status != 1)
                    // Cập nhật trạng thái detail
                    await campaignApi.changeStatusCampaignDetail2({
                      id: resDetail.id,
                      status: resDetail.status,
                      errorMessage: resDetail.message,
                    });
                }
                if (resAddMemberToGroups.isLimitSearchPhone) {
                  isLimitSearchPhone = true;
                  break;
                }
                addGroupDetails = [];
                if (
                  countProcessed >= (campaign.countSendingOfDay ?? 0) ||
                  countProcessed >= (campaign.countSendingOfHour ?? 9)
                )
                  break;
              }
              addGroupDetails.push({
                id: campaign.details[i].id,
                phone: campaign.details[i].phone,
                zid: campaign.details[i].groupUserId,
              });
              countProcessed++;
            } catch (e) {
              console.log("Lỗi khi Inbox/Kết bạn đến SĐT: ", e);
              // Cập nhật trạng thái detail
              await campaignApi.changeStatusCampaignDetail(
                campaign.details[i].id,
                10,
                "Có lỗi xảy ra"
              );

              // addNote(
              //   `${getDateTimeNow()} - Thêm thành viên vào group ${
              //     campaign.details[i].phone
              //   } - Thất bại - Có lỗi xảy ra`
              // );
              await sleep(campaign.timeSleepBetween2 * 1000);
            }
          }
        }
        // Kết thúc
        if (isLimitSearchPhone) {
          const newSchedule = new Date();
          newSchedule.setHours(newSchedule.getHours() + 8);
          newSchedule.setMinutes(0, 0, 0);
          await campaignApi.changeScheduleCampaign({
            id: campaign.id,
            schedule: newSchedule,
          });
          // addNote(
          //   `${getDateTimeNow()} - Chiến dịch ${
          //     campaign.name
          //   } - Hết lượt tìm kiếm SĐT - Tạm nghỉ 60 phút`
          // );
        } else {
          if (countProcessed >= (campaign.countSendingOfDay ?? 0)) {
            if (
              (i == campaign.details.length &&
                campaign.campaignActionId != SEND_HPBD &&
                campaign.campaignActionId != CANCEL_REQUEST) ||
              (campaign.campaignActionId == CANCEL_REQUEST &&
                countProcessed + (campaign.countActionProcessed ?? 0) >=
                  (campaign.countPost ?? 0))
            ) {
              await campaignApi.changeStatusCampaign(campaign.id, "Hoàn thành");
              // addNote(
              //   `${getDateTimeNow()} - Chiến dịch ${
              //     campaign.name
              //   } - Kết thúc - Hết lượt gửi trong ngày`
              // );
            } else {
              // addNote(
              //   `${getDateTimeNow()} - Chiến dịch ${
              //     campaign.name
              //   } - Tạm dừng - Hết lượt gửi trong ngày`
              // );
            }
          } else {
            await campaignApi.changeStatusCampaign(campaign.id, "Hoàn thành");
            // addNote(
            //   `${getDateTimeNow()} - Chiến dịch ${campaign.name} - Kết thúc`
            // );
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const sendToPhone = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  isSendBySearchName,
  phone,
  zid,
  isSendMessage,
  isAddFriend,
  content,
  isContentAI,
  media,
  isSendFolderMedia,
  isRandomFolderMedia,
  countRandomFolderMedia,
  contentAddFriend,
  isAddTag,
  tagName,
  isRename,
  nameToChange,
  contentSms
) => {
  try {
    if (!isSendBySearchName && !zid?.trim()) {
      const resSearchPhone = await zaloWebApi.searchPhone(
        cookie,
        imei,
        secretKey,
        phone.replace("0", "84")
      );
      if (resSearchPhone.error_code == 0) {
        zid = resSearchPhone.data?.uid;
      } else if (
        resSearchPhone.error_code == 312 ||
        resSearchPhone.error_code == 221
      ) {
        return {
          status: 1,
        };
      }
      if (!zid?.trim()) {
        return {
          status: 13,
          message: resSearchPhone.error_message,
        };
      }
    }
    let resGetInfo = await zaloWebApi.getProfile(cookie, imei, secretKey, zid);
    if (!resGetInfo) {
      const resSearchPhone = await zaloWebApi.searchPhone(
        cookie,
        imei,
        secretKey,
        phone.replace("0", "84")
      );
      if (resSearchPhone.error_code == 0) {
        zid = resSearchPhone.data?.uid;
      } else if (
        resSearchPhone.error_code == 312 ||
        resSearchPhone.error_code == 221
      ) {
        return {
          status: 1,
        };
      }
      if (!zid?.trim()) {
        return {
          status: 13,
          message: resSearchPhone.error_message,
        };
      }
      resGetInfo = await zaloWebApi.getProfile(cookie, imei, secretKey, zid);
    }
    if (!resGetInfo) {
      return {
        status: 13,
        message: "Không tồn tại",
      };
    }
    const info = resGetInfo
      ? {
          zid: resGetInfo.userId,
          name: resGetInfo.displayName,
          originalName: resGetInfo.zaloName,
          gender: resGetInfo.gender == 1 ? "Nữ" : "Nam",
          uid: getUidFromAvatarLink(resGetInfo.avatar),
          avatarLink: resGetInfo.avatar,
          friendStatus:
            resGetInfo.isFr == 1
              ? FriendStatusConstant.IS_FRIEND
              : FriendStatusConstant.NOT_FRIEND,
        }
      : null;

    contentSms = contentSms?.replaceAll(
      "[fullname_original]",
      "[fullname_web]"
    );
    contentSms = replaceVocative(
      contentSms?.replaceAll("[fullname_web]", info?.name ?? ""),
      info?.gender
    );

    let resSendMessage, resAddFriend;
    if (isSendMessage) {
      content = content?.replaceAll("[fullname_original]", "[fullname_web]");
      content = replaceVocative(
        content?.replaceAll("[fullname_web]", info?.name ?? ""),
        info?.gender
      );
      // if (isContentAI && content?.trim()) {
      //   content = (
      //     await aiApi.chat2(content, "write_content", shopId, "zalo_extension")
      //   )?.data;
      // }
      let images = [];
      if (media) {
        images = media.split("|");
        if (isSendFolderMedia && isRandomFolderMedia)
          images = getRandomArray(images, countRandomFolderMedia);
        if (!isSendFolderMedia) images = images.slice(0, 1);
      }
      if (images && images?.length == 1) {
        const blob = await urlToBlob(images[0]);
        const resUpload = await zaloWebApi.uploadImage(
          cookie,
          imei,
          secretKey,
          zid,
          blob
        );
        const imgUrl = resUpload.data.normalUrl;
        const imgInfo = await getInfoImageFromUrl(imgUrl);
        resSendMessage = await zaloWebApi.sendImage(
          cookie,
          imei,
          secretKey,
          zid,
          imgUrl,
          imgInfo,
          content
        );
      } else {
        const groupLayoutId = Date.now();
        for (let iImg = 0; iImg < (images?.length ?? 0); iImg++) {
          try {
            const blob = await urlToBlob(images[iImg]);
            const resUpload = await zaloWebApi.uploadImage(
              cookie,
              imei,
              secretKey,
              zid,
              blob
            );
            const imgUrl = resUpload.data.normalUrl;
            const imgInfo = await getInfoImageFromUrl(imgUrl);
            resSendMessage = await zaloWebApi.sendImage(
              cookie,
              imei,
              secretKey,
              zid,
              imgUrl,
              imgInfo,
              "",
              true,
              groupLayoutId,
              images.length,
              1,
              iImg
            );
            if (resSendMessage.error_code != 0) {
              return {
                status: 10,
                message: resSendMessage.error_message,
                content: content,
                info: info,
              };
            }
          } catch (error) {
            console.log("Có lỗi khi gửi ảnh: ", error);
          }
        }
        if (content?.trim())
          resSendMessage = await zaloWebApi.sms(
            cookie,
            imei,
            secretKey,
            zid,
            content
          );
      }
    }

    if (isAddFriend) {
      contentAddFriend = contentAddFriend?.replaceAll(
        "[fullname_original]",
        "[fullname_web]"
      );
      contentAddFriend = replaceVocative(
        contentAddFriend?.replaceAll("[fullname_web]", info?.name ?? ""),
        info?.gender
      );
      resAddFriend = await zaloWebApi.addFriend(
        cookie,
        imei,
        secretKey,
        zid,
        contentAddFriend
      );
    }

    try {
      if (isRename) {
        await api.changeFriendAlias(
          replaceVocative(
            nameToChange.replaceAll("[fullname_web]", info.name),
            info.gender
          ),
          zid
        );
      }
    } catch (error) {
      console.log("Có lỗi khi đổi biệt danh: ", error);
    }

    if (resSendMessage && resAddFriend) {
      if (resSendMessage.error_code == 0)
        return {
          status: 2,
          message:
            "Gửi tin nhắn thành công - " +
            (resAddFriend.error_code == 0 ||
            resAddFriend.error_code == 222 ||
            resAddFriend.error_code == 225
              ? "Gửi lời mời kết bạn thành công"
              : resAddFriend.error_message),
          content: content,
          info: info,
          contentSms: contentSms,
        };
      else
        return {
          status: 10,
          message:
            resSendMessage.error_message +
            " - " +
            (resAddFriend.error_code == 0 ||
            resAddFriend.error_code == 222 ||
            resAddFriend.error_code == 225
              ? "Gửi lời mời kết bạn thành công"
              : resAddFriend.error_message),
          content: content,
          info: info,
          contentSms: contentSms,
        };
    } else if (resSendMessage) {
      if (resSendMessage.error_code == 0)
        return {
          status: 2,
          message: "Gửi tin nhắn thành công",
          content: content,
          info: info,
          contentSms: contentSms,
        };
      else
        return {
          status: 10,
          message: resSendMessage.error_message,
          content: content,
          info: info,
          contentSms: contentSms,
        };
    } else if (resAddFriend) {
      if (
        resAddFriend.error_code == 0 ||
        resAddFriend.error_code == 222 ||
        resAddFriend.error_code == 225
      )
        return {
          status: 2,
          message: "Gửi lời mời kết bạn thành công",
          content: contentAddFriend,
          info: info,
          contentSms: contentSms,
        };
      else
        return {
          status: 10,
          message: resAddFriend.error_message,
          content: contentAddFriend,
          info: info,
          contentSms: contentSms,
        };
    } else
      return {
        status: 10,
        message: "Có lỗi xảy ra",
        contentSms: contentSms,
      };
  } catch (e) {
    console.log("Lỗi khi thực hiện Inbox/Kết bạn đến SĐT: ", e);
    return {
      status: 10,
      message: "Có lỗi xảy ra",
      contentSms: contentSms,
    };
  }
};

const sendToGroup = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  name,
  zid,
  content,
  isContentAI,
  media,
  isSendFolderMedia,
  isRandomFolderMedia,
  countRandomFolderMedia
) => {
  try {
    let info = { name: name };

    content = content.replaceAll(
      "[fullname_original]",
      info?.originalName ?? "[fullname_web]"
    );
    content = replaceVocative(
      content?.replaceAll("[fullname_web]", info?.name ?? ""),
      info?.gender
    );

    // if (isContentAI && content?.trim()) {
    //   content = (
    //     await aiApi.chat2(content, "write_content", shopId, "zalo_extension")
    //   )?.data;
    // }
    let images = [];
    if (media) {
      images = media.split("|");
      if (isSendFolderMedia && isRandomFolderMedia)
        images = getRandomArray(images, countRandomFolderMedia);
      if (!isSendFolderMedia) images = images.slice(0, 1);
    }

    let resSendMessage;
    if (images && images?.length == 1) {
      const blob = await urlToBlob(images[0]);
      const resUpload = await zaloWebApi.uploadImage(
        cookie,
        imei,
        secretKey,
        zid,
        blob
      );
      const imgUrl = resUpload.data.normalUrl;
      const imgInfo = await getInfoImageFromUrl(imgUrl);
      resSendMessage = await zaloWebApi.groupSendImage(
        cookie,
        imei,
        secretKey,
        zid,
        imgUrl,
        imgInfo,
        content
      );
    } else {
      const groupLayoutId = Date.now();
      for (let iImg = 0; iImg < (images?.length ?? 0); iImg++) {
        try {
          const blob = await urlToBlob(images[iImg]);
          const resUpload = await zaloWebApi.uploadImage(
            cookie,
            imei,
            secretKey,
            zid,
            blob
          );
          const imgUrl = resUpload.data.normalUrl;
          const imgInfo = await getInfoImageFromUrl(imgUrl);
          resSendMessage = await zaloWebApi.groupSendImage(
            cookie,
            imei,
            secretKey,
            zid,
            imgUrl,
            imgInfo,
            "",
            true,
            groupLayoutId,
            images.length,
            1,
            iImg
          );
          if (resSendMessage.error_code != 0) {
            return {
              status: 10,
              message: resSendMessage.error_message,
              content: content,
              info: info,
            };
          }
        } catch (error) {
          console.log("Có lỗi khi gửi ảnh: ", error);
        }
      }
      if (content?.trim())
        resSendMessage = await zaloWebApi.groupSendMsg(
          cookie,
          imei,
          secretKey,
          zid,
          content
        );
    }

    if (resSendMessage.error_code == 0)
      return {
        status: 2,
        message: "Gửi tin nhắn thành công",
        content: content,
        info: info,
      };
    else
      return {
        status: 10,
        message: resSendMessage.error_message,
        content: content,
        info: info,
      };
  } catch (e) {
    console.log("Lỗi khi thực hiện Inbox đến group: ", e);
    return {
      status: 10,
      message: e,
    };
  }
};

const sendToFriend = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  zid,
  content,
  isContentAI,
  media,
  isSendFolderMedia,
  isRandomFolderMedia,
  countRandomFolderMedia,
  isAddTag,
  tagName
) => {
  try {
    let resGetInfo = await zaloWebApi.getProfile(cookie, imei, secretKey, zid);

    const info = resGetInfo
      ? {
          zid: resGetInfo.userId,
          name: resGetInfo.displayName,
          originalName: resGetInfo.zaloName,
          gender: resGetInfo.gender == 1 ? "Nữ" : "Nam",
          uid: getUidFromAvatarLink(resGetInfo.avatar),
          avatarLink: resGetInfo.avatar,
          friendStatus:
            resGetInfo.isFr == 1
              ? FriendStatusConstant.IS_FRIEND
              : FriendStatusConstant.NOT_FRIEND,
        }
      : null;

    content = content.replaceAll(
      "[fullname_original]",
      info?.originalName ?? "[fullname_web]"
    );
    content = replaceVocative(
      content?.replaceAll("[fullname_web]", info?.name ?? ""),
      info?.gender
    );
    // if (isContentAI && content?.trim()) {
    //   content = (
    //     await aiApi.chat2(content, "write_content", shopId, "zalo_extension")
    //   )?.data;
    // }
    let images = [];
    if (media) {
      images = media.split("|");
      if (isSendFolderMedia && isRandomFolderMedia)
        images = getRandomArray(images, countRandomFolderMedia);
      if (!isSendFolderMedia) images = images.slice(0, 1);
    }

    let resSendMessage;
    if (images && images?.length == 1) {
      const blob = await urlToBlob(images[0]);
      const resUpload = await zaloWebApi.uploadImage(
        cookie,
        imei,
        secretKey,
        zid,
        blob
      );
      const imgUrl = resUpload.data.normalUrl;
      const imgInfo = await getInfoImageFromUrl(imgUrl);
      resSendMessage = await zaloWebApi.sendImage(
        cookie,
        imei,
        secretKey,
        zid,
        imgUrl,
        imgInfo,
        content
      );
    } else {
      const groupLayoutId = Date.now();
      for (let iImg = 0; iImg < (images?.length ?? 0); iImg++) {
        try {
          const blob = await urlToBlob(images[iImg]);
          const resUpload = await zaloWebApi.uploadImage(
            cookie,
            imei,
            secretKey,
            zid,
            blob
          );
          const imgUrl = resUpload.data.normalUrl;
          const imgInfo = await getInfoImageFromUrl(imgUrl);
          resSendMessage = await zaloWebApi.sendImage(
            cookie,
            imei,
            secretKey,
            zid,
            imgUrl,
            imgInfo,
            "",
            true,
            groupLayoutId,
            images.length,
            1,
            iImg
          );
          if (resSendMessage.error_code != 0) {
            return {
              status: 10,
              message: resSendMessage.error_message,
              content: content,
              info: info,
            };
          }
        } catch (error) {
          console.log("Có lỗi khi gửi ảnh: ", error);
        }
      }
      if (content?.trim())
        resSendMessage = await zaloWebApi.sms(
          cookie,
          imei,
          secretKey,
          zid,
          content
        );
    }

    if (resSendMessage.error_code == 0)
      return {
        status: 2,
        message: "Gửi tin nhắn thành công",
        content: content,
        info: info,
      };
    else
      return {
        status: 10,
        message: resSendMessage.error_message,
        content: content,
        info: info,
      };
  } catch (e) {
    console.log("Lỗi khi thực hiện Inbox đến bạn bè: ", e);
    return {
      status: 10,
      message: e,
    };
  }
};

const sendToFriendByShareApi = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  paramIds,
  content,
  isContentAI,
  media,
  isSendFolderMedia,
  isRandomFolderMedia,
  countRandomFolderMedia
) => {
  try {
    // if (isContentAI && content?.trim()) {
    //   content = (
    //     await aiApi.chat2(content, "write_content", shopId, "zalo_extension")
    //   )?.data;
    // }
    let images = [];
    if (media) {
      images = media.split("|");
      if (isSendFolderMedia && isRandomFolderMedia)
        images = getRandomArray(images, countRandomFolderMedia);
      if (!isSendFolderMedia) images = images.slice(0, 1);
    }

    let resSendMessage;
    let uploadedImgs = [];
    if (images && images?.length == 1) {
      const blob = await urlToBlob(images[0]);
      const resUpload = await zaloWebApi.uploadImage(
        cookie,
        imei,
        secretKey,
        paramIds[0].toUid,
        blob
      );
      const imgUrl = resUpload.data.normalUrl;
      const imgInfo = await getInfoImageFromUrl(imgUrl);
      uploadedImgs.push({
        imgUrl,
        imgInfo,
      });
    } else {
      for (let iImg = 0; iImg < (images?.length ?? 0); iImg++) {
        try {
          const blob = await urlToBlob(images[iImg]);
          const resUpload = await zaloWebApi.uploadImage(
            cookie,
            imei,
            secretKey,
            paramIds[0].toUid,
            blob
          );
          const imgUrl = resUpload.data.normalUrl;
          const imgInfo = await getInfoImageFromUrl(imgUrl);
          uploadedImgs.push({
            imgUrl,
            imgInfo,
          });
        } catch (error) {
          console.log("Có lỗi khi gửi ảnh: ", error);
        }
      }
    }

    for (let j = 0; j < paramIds.length; j++) {
      const groupLayoutId = Date.now();
      for (let iImg = 0; iImg < (uploadedImgs?.length ?? 0); iImg++) {
        try {
          resSendMessage = await zaloWebApi.sendImage(
            cookie,
            imei,
            secretKey,
            paramIds[j].toUid,
            uploadedImgs[iImg].imgUrl,
            uploadedImgs[iImg].imgInfo,
            "",
            true,
            groupLayoutId,
            uploadedImgs.length,
            1,
            iImg
          );
        } catch (error) {
          console.log("Có lỗi khi gửi ảnh: ", error);
        }
      }
    }
    if (content?.trim())
      resSendMessage = await zaloWebApi.shareSms(
        cookie,
        imei,
        secretKey,
        paramIds,
        content
      );

    if (resSendMessage.error_code == 0)
      return {
        status: 2,
        message: `Gửi thành công: ${
          resSendMessage.data?.success?.length ?? 0
        }, thất bại:  ${resSendMessage.data?.fail?.length ?? 0}`,
        resApi: resSendMessage,
      };
    else
      return {
        status: 10,
        message: resSendMessage.error_message,
      };
  } catch (e) {
    console.log("Lỗi khi thực hiện Inbox đến bạn bè: ", e);
    return {
      status: 10,
      message: "Tham số sai định dạng",
    };
  }
};

const sendToGroupMember = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  zid,
  isSendMessage,
  isAddFriend,
  content,
  isContentAI,
  media,
  isSendFolderMedia,
  isRandomFolderMedia,
  countRandomFolderMedia,
  contentAddFriend,
  isAddTag,
  tagName
) => {
  try {
    let resGetInfo = await zaloWebApi.getProfile(cookie, imei, secretKey, zid);
    if (!resGetInfo) {
      return {
        status: 13,
        message: "Không tồn tại",
      };
    }
    const info = resGetInfo
      ? {
          zid: resGetInfo.userId,
          name: resGetInfo.displayName,
          originalName: resGetInfo.zaloName,
          gender: resGetInfo.gender == 1 ? "Nữ" : "Nam",
          uid: getUidFromAvatarLink(resGetInfo.avatar),
          avatarLink: resGetInfo.avatar,
          friendStatus:
            resGetInfo.isFr == 1
              ? FriendStatusConstant.IS_FRIEND
              : FriendStatusConstant.NOT_FRIEND,
        }
      : null;

    let resSendMessage, resAddFriend;
    if (isSendMessage) {
      content = content?.replaceAll("[fullname_original]", "[fullname_web]");
      content = replaceVocative(
        content?.replaceAll("[fullname_web]", info?.name ?? ""),
        info?.gender
      );
      // if (isContentAI && content?.trim()) {
      //   content = (
      //     await aiApi.chat2(content, "write_content", shopId, "zalo_extension")
      //   )?.data;
      // }
      let images = [];
      if (media) {
        images = media.split("|");
        if (isSendFolderMedia && isRandomFolderMedia)
          images = getRandomArray(images, countRandomFolderMedia);
        if (!isSendFolderMedia) images = images.slice(0, 1);
      }
      if (images && images?.length == 1) {
        const blob = await urlToBlob(images[0]);
        const resUpload = await zaloWebApi.uploadImage(
          cookie,
          imei,
          secretKey,
          zid,
          blob
        );
        const imgUrl = resUpload.data.normalUrl;
        const imgInfo = await getInfoImageFromUrl(imgUrl);
        resSendMessage = await zaloWebApi.sendImage(
          cookie,
          imei,
          secretKey,
          zid,
          imgUrl,
          imgInfo,
          content
        );
      } else {
        const groupLayoutId = Date.now();
        for (let iImg = 0; iImg < (images?.length ?? 0); iImg++) {
          try {
            const blob = await urlToBlob(images[iImg]);
            const resUpload = await zaloWebApi.uploadImage(
              cookie,
              imei,
              secretKey,
              zid,
              blob
            );
            const imgUrl = resUpload.data.normalUrl;
            const imgInfo = await getInfoImageFromUrl(imgUrl);
            resSendMessage = await zaloWebApi.sendImage(
              cookie,
              imei,
              secretKey,
              zid,
              imgUrl,
              imgInfo,
              "",
              true,
              groupLayoutId,
              images.length,
              1,
              iImg
            );
            if (resSendMessage.error_code != 0) {
              return {
                status: 10,
                message: resSendMessage.error_message,
                content: content,
                info: info,
              };
            }
          } catch (error) {
            console.log("Có lỗi khi gửi ảnh: ", error);
          }
        }
        if (content?.trim())
          resSendMessage = await zaloWebApi.sms(
            cookie,
            imei,
            secretKey,
            zid,
            content
          );
      }
    }

    if (isAddFriend) {
      contentAddFriend = contentAddFriend?.replaceAll(
        "[fullname_original]",
        "[fullname_web]"
      );
      contentAddFriend = replaceVocative(
        contentAddFriend?.replaceAll("[fullname_web]", info?.name ?? ""),
        info?.gender
      );
      resAddFriend = await zaloWebApi.addFriend(
        cookie,
        imei,
        secretKey,
        zid,
        contentAddFriend
      );
    }

    if (resSendMessage && resAddFriend) {
      if (resSendMessage.error_code == 0)
        return {
          status: 2,
          message:
            "Gửi tin nhắn thành công - " +
            (resAddFriend.error_code == 0 ||
            resAddFriend.error_code == 222 ||
            resAddFriend.error_code == 225
              ? "Gửi lời mời kết bạn thành công"
              : resAddFriend.error_message),
          content: content,
          info: info,
        };
      else
        return {
          status: 10,
          message:
            resSendMessage.error_message +
            " - " +
            (resAddFriend.error_code == 0 ||
            resAddFriend.error_code == 222 ||
            resAddFriend.error_code == 225
              ? "Gửi lời mời kết bạn thành công"
              : resAddFriend.error_message),
          content: content,
          info: info,
        };
    } else if (resSendMessage) {
      if (resSendMessage.error_code == 0)
        return {
          status: 2,
          message: "Gửi tin nhắn thành công",
          content: content,
          info: info,
        };
      else
        return {
          status: 10,
          message: resSendMessage.error_message,
          content: content,
          info: info,
        };
    } else if (resAddFriend) {
      if (
        resAddFriend.error_code == 0 ||
        resAddFriend.error_code == 222 ||
        resAddFriend.error_code == 225
      )
        return {
          status: 2,
          message: "Gửi lời mời kết bạn thành công",
          content: contentAddFriend,
          info: info,
        };
      else
        return {
          status: 10,
          message: resAddFriend.error_message,
          content: contentAddFriend,
          info: info,
        };
    } else
      return {
        status: 10,
        message: "Có lỗi xảy ra",
      };
  } catch (e) {
    console.log("Lỗi khi thực hiện Inbox/Kết bạn đến thành viên group: ", e);
    return {
      status: 10,
      message: "Có lỗi xảy ra",
    };
  }
};

const addMembersToGroup = async (
  api,
  cookie,
  imei,
  secretKey,
  shopId,
  groupId,
  addGroupDetails,
  timeSleepBetween2
) => {
  let isLimitSearchPhone = false;
  try {
    let memberIds = [];
    for (const detail of addGroupDetails) {
      if (isLimitSearchPhone) {
        detail.status = 1;
        continue;
      }
      if (!detail.zid) {
        const resSearchPhone = await zaloWebApi.searchPhone(
          cookie,
          imei,
          secretKey,
          detail.phone?.replace("0", "84")
        );
        if (resSearchPhone.error_code == 0) {
          detail.zid = resSearchPhone.data?.uid;
          memberIds.push(resSearchPhone.data?.uid);
        } else if (
          resSearchPhone.error_code == 312 ||
          resSearchPhone.error_code == 221
        ) {
          isLimitSearchPhone = true;
          detail.status = 1;
          continue;
        }
        if (!detail.zid) {
          detail.status = 13;
        }
      } else if (!detail.zid) {
        detail.status = 13;
      } else memberIds.push(detail.zid);
      await sleep(timeSleepBetween2 * 1000);
    }
    const resAdd = await zaloWebApi.inviteGroup(
      cookie,
      imei,
      secretKey,
      groupId,
      memberIds
    );

    if (resAdd.error_code == 0) {
      for (const detail of addGroupDetails) {
        if (resAdd.data?.errorMembers?.includes(detail.zid)) detail.status = 10;
        else if (!detail.status) detail.status = 2;
      }
    } else {
      for (const detail of addGroupDetails) {
        if (!detail.status) detail.status = 10;
      }
    }
    return {
      resDetails: addGroupDetails,
      isLimitSearchPhone,
    };
  } catch (e) {
    console.log("Lỗi khi thực hiện thêm thành viên vào group: ", e);
    for (const detail of addGroupDetails) {
      if (!detail.status) detail.status = 10;
    }
    return {
      status: 10,
      message: "Có lỗi xảy ra",
      resDetails: addGroupDetails,
      isLimitSearchPhone,
    };
  }
};

const akaBizRunningService = {
  start,
};

export default akaBizRunningService;
