import fetch from "node-fetch";
import FormData from "form-data";
import {
  createEncryptKey,
  decodeAES,
  decodeAESwithSecretKey,
  encodeAES,
  encodeAESwithSecretKey,
  getSignKey,
  randomString,
} from "../utils/commonZaloWebApi.js";

const apiVersion = 648;
const computerName = "Web";
const apiType = 30;
const enc_ver = "v2";
const language = "vi";

const zaloWebApi = {
  getSecretKey: (cookie, imei) => {
    const s = `${apiType},${imei},${Date.now()}`;
    const zcid = encodeAES("3FC4F0D2AB50057BCE0D90D9187A22B1", s, "hex", !0);
    const zcid_ext = randomString();
    const enk = createEncryptKey(0, zcid, zcid_ext);
    const params = encodeURIComponent(
      encodeAES(
        enk,
        JSON.stringify({
          imei: imei,
          computer_name: computerName,
          language: language,
          ts: Date.now(),
        }),
        "base64",
        !1
      )
    );

    const signkey = getSignKey("getlogininfo", {
      client_version: apiVersion,
      enc_ver: enc_ver,
      params: params,
      type: apiType,
      zcid: zcid,
      zcid_ext: zcid_ext,
    });

    const url = `https://wpa.chat.zalo.me/api/login/getLoginInfo?zcid=${zcid}&zcid_ext=${zcid_ext}&enc_ver=${enc_ver}&params=${params}&type=${apiType}&client_version=${apiVersion}&signkey=${signkey}&nretry=0`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        const data = JSON.parse(decodeAES(enk, result.data))?.data;
        return { secretKey: data?.zpw_enk, zaloId: data?.uid };
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getProfile: (cookie, imei, secretKey, id) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        phonebook_version: Date.now(),
        friend_pversion_map: [`${id}_0`],
        avatar_size: 120,
        language: "vi",
        show_online_status: 1,
        imei: imei,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-profile-wpa.chat.zalo.me/api/social/friend/getprofiles/v2?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))?.data
              ?.changed_profiles[id]
          : null;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  sms: (cookie, imei, secretKey, id, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        clientId: Date.now(),
        imei: imei,
        message: content,
        toid: id,
        ttl: 0,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-chat1-wpa.chat.zalo.me/api/message/sms?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  uploadImage: async (cookie, imei, secretKey, id, file) => {
    // Đảm bảo id luôn là string
    const safeId = id.toString();
    // console.log('uploadImage id:', safeId); // Bỏ comment dòng này để debug nếu cần
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          totalChunk: 1,
          fileName: "undefined",
          clientId: Date.now(),
          totalSize: file.size,
          imei: imei,
          chunkId: 1,
          toid: safeId,
          //isE2EE: 0,
          jxl: 1,
        })
      )
    );

    const formData = new FormData();
    formData.append("chunkContent", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const url = `https://tt-files-wpa.chat.zalo.me/api/message/photo_original/upload?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}&type=2`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
      },
      body: formData,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  sendImage: (cookie, imei, secretKey, id, imgUrl, imgInfo, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        photoId: "1",
        clientId: Date.now(),
        desc: content ?? "",
        width: imgInfo.width,
        height: imgInfo.height,
        toid: id,
        rawUrl: imgUrl,
        thumbUrl: imgUrl,
        normalUrl: imgUrl,
        hdUrl: imgUrl,
        zsource: -1,
        jcp: '{"convertible":"jxl"}',
        ttl: 0,
        imei: imei,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-files-wpa.chat.zalo.me/api/message/photo_original/send?zpw_ver=${apiVersion}&zpw_type=${apiType}&nretry=0`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  groupSendMsg: (cookie, imei, secretKey, id, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        message: content,
        clientId: Date.now(),
        imei: imei,
        ttl: 0,
        visibility: 0,
        grid: id,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/sendmsg?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  groupSendImage: (cookie, imei, secretKey, id, imgUrl, imgInfo, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        photoId: "1",
        clientId: Date.now(),
        desc: content ?? "",
        width: imgInfo.width,
        height: imgInfo.height,
        grid: id,
        rawUrl: imgUrl,
        thumbUrl: imgUrl,
        oriUrl: imgUrl,
        hdUrl: imgUrl,
        zsource: -1,
        jcp: '{"convertible":"jxl"}',
        ttl: 0,
        imei: imei,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-files-wpa.chat.zalo.me/api/group/photo_original/send?zpw_ver=${apiVersion}&zpw_type=${apiType}&nretry=0`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  shareSms: (cookie, imei, secretKey, paramIds, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        toIds: paramIds,
        imei: imei,
        ttl: 0,
        msgType: "1",
        totalIds: paramIds.length,
        msgInfo: JSON.stringify({
          message: content,
        }),
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-files-wpa.chat.zalo.me/api/message/mforward?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  // shareImage: (cookie, imei, secretKey, id, imgUrl, imgInfo, content) => {
  //   const params = encodeAESwithSecretKey(
  //     secretKey,
  //     JSON.stringify({
  //       toId: id,
  //       imei: imei,
  //       ttl: 0,
  //       zsource: -1,
  //       msgType: 2,
  //       clientId: Date.now(),
  //       msgInfo: JSON.stringify({
  //         title: content,
  //         oriUrl: imgUrl,
  //         thumbUrl: imgUrl,
  //         hdUrl: imgUrl,
  //         width: imgInfo.width,
  //         height: imgInfo.height,
  //         properties: null,
  //         normalUrl: "",
  //         jcp: '{"convertible":"jxl"}',
  //       }),
  //     })
  //   );
  //   var urlencoded = new URLSearchParams();
  //   urlencoded.append("params", params);
  //   const url = `https://tt-files-wpa.chat.zalo.me/api/message/forward?zpw_ver=${apiVersion}&zpw_type=${apiType}&nretry=0`;
  //   return fetch(url, {
  //     method: "POST",
  //     headers: {
  //       Cookie: cookie,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: urlencoded,
  //     redirect: "follow",
  //     credentials: "include",
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Error ${response.status}: ${response.statusText}`);
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       return result.data
  //         ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
  //         : result;
  //     })
  //     .catch((error) => {
  //       // Xử lý lỗi ở đây nếu cần
  //       console.error("Fetch error:", error);
  //       throw error;
  //     });
  // },
  searchPhone: (cookie, imei, secretKey, phone) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          phone: phone,
          avatar_size: 240,
          language: language,
          imei: imei,
          reqSrc: 40,
        })
      )
    );

    const url = `https://tt-friend-wpa.chat.zalo.me/api/friend/profile/get?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getReqStatus: (cookie, imei, secretKey, id) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          fid: id,
          imei: imei,
        })
      )
    );

    const url = `https://tt-friend-wpa.chat.zalo.me/api/friend/reqstatus?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  addFriend: (cookie, imei, secretKey, id, content) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        toid: id,
        msg: content,
        reqsrc: 40,
        imei: imei,
        language: language,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-friend-wpa.chat.zalo.me/api/friend/sendreq?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  removeFriend: (cookie, imei, secretKey, id) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        fid: id,
        imei: imei,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-friend-wpa.chat.zalo.me/api/friend/remove?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getFriends: (cookie, imei, secretKey) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          incInvalid: 1,
          page: 1,
          count: 20000,
          avatar_size: 120,
          actiontime: 0,
          imei: imei,
        })
      )
    );

    const url = `https://tt-profile-wpa.chat.zalo.me/api/social/friend/getfriends?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getTags: (cookie, imei, secretKey) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          imei: imei,
        })
      )
    );

    const url = `https://label-wpa.chat.zalo.me/api/convlabel/get?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getGroupIds: (cookie, imei, secretKey) => {
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/getlg/v4?zpw_ver=${apiVersion}&zpw_type=${apiType}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getGroupInfos: (cookie, imei, secretKey, ids) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        gridVerMap: `{${ids.map((x) => `"${x}":0`)}}`,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/getmg-v2?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getGroupMemberIds: (cookie, imei, secretKey, id) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        gridVerMap: `{"${id}":0}`,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/getmg-v2?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  getGroupMemberInfos: (cookie, imei, secretKey, ids) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        friend_pversion_map: ids,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-profile-wpa.chat.zalo.me/api/social/group/members?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  createGroup: (cookie, imei, secretKey, groupName, contacts) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          clientId: Date.now(),
          gname: groupName,
          gdesc: null,
          members: contacts.map((x) => x.uid),
          memberTypes: contacts.map((x) => (x.isFriend ? -1 : 85)),
          nameChanged: 0,
          createLink: 1,
          clientLang: "vi",
          imei: imei,
          groupType: 1,
          zsource: 601,
        })
      )
    );

    const url = `https://tt-group-wpa.chat.zalo.me/api/group/create/v2?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  leaveGroup: (cookie, imei, secretKey, id) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        grids: [id],
        imei: imei,
        silent: 0,
        language: language,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/leave?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  inviteGroup: (cookie, imei, secretKey, id, memberIds) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        grid: id,
        members: memberIds,
        memberTypes: memberIds.map(() => -1),
        imei: imei,
        clientLang: language,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/invite/v2?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  rename: (cookie, imei, secretKey, id, newName) => {
    const params = encodeURIComponent(
      encodeAESwithSecretKey(
        secretKey,
        JSON.stringify({
          friendId: id,
          alias: newName,
          imei: imei,
        })
      )
    );

    const url = `https://tt-alias-wpa.chat.zalo.me/api/alias/update?zpw_ver=${apiVersion}&zpw_type=${apiType}&params=${params}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  reactMessage: (
    cookie,
    imei,
    secretKey,
    id,
    msgId,
    cliMsgId,
    type,
    rIcon,
    rType
  ) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        react_list: [
          {
            message: JSON.stringify({
              rMsg: [
                {
                  gMsgID: msgId,
                  cMsgID: cliMsgId,
                  msgType: type === "text" ? 1 : 2,
                },
              ],
              rIcon: rIcon,
              rType: rType,
              source: 6,
            }),
            clientId: Date.now(),
          },
        ],
        toid: id,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://reaction.chat.zalo.me/api/message/reaction?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  reactMessageGroup: (
    cookie,
    imei,
    secretKey,
    id,
    msgId,
    cliMsgId,
    type,
    rIcon,
    rType
  ) => {
    id = id.replace("g", "");
    console.log(id);
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        react_list: [
          {
            message: JSON.stringify({
              rMsg: [
                {
                  gMsgID: msgId,
                  cMsgID: cliMsgId,
                  msgType: type === "text" ? 1 : 2,
                },
              ],
              rIcon: rIcon,
              rType: rType,
              source: 6,
            }),
            clientId: Date.now(),
          },
        ],
        grid: id,
        imei: imei,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://reaction.chat.zalo.me/api/group/reaction?zpw_ver=${apiVersion}&zpw_type=${apiType}`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  quote: (
    cookie,
    imei,
    secretKey,
    id,
    content,
    ownerId,
    msgId,
    cliMsgId,
    type,
    msgTs,
    msgContent
  ) => {
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        toid: id,
        message: content,
        clientId: Date.now(),
        qmsgOwner: ownerId,
        qmsgId: msgId,
        qmsgCliId: cliMsgId,
        qmsgType: type === "text" ? 1 : 32,
        qmsgTs: msgTs,
        qmsg: msgContent,
        imei: imei,
        qmsgTTL: 0,
        ttl: 0,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-chat1-wpa.chat.zalo.me/api/message/quote?zpw_ver=${apiVersion}&zpw_type=${apiType}&nretry=0`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
  quoteGroup: (
    cookie,
    imei,
    secretKey,
    id,
    content,
    ownerId,
    msgId,
    cliMsgId,
    type,
    msgTs,
    msgContent
  ) => {
    id = id.replace("g", "");
    const params = encodeAESwithSecretKey(
      secretKey,
      JSON.stringify({
        grid: id,
        message: content,
        clientId: Date.now(),
        qmsgOwner: ownerId,
        qmsgId: msgId,
        qmsgCliId: cliMsgId,
        qmsgType: type === "text" ? 1 : 32,
        qmsgTs: msgTs,
        qmsg: msgContent,
        visibility: 0,
        qmsgTTL: 0,
        ttl: 0,
      })
    );
    var urlencoded = new URLSearchParams();
    urlencoded.append("params", params);
    const url = `https://tt-group-wpa.chat.zalo.me/api/group/quote?zpw_ver=${apiVersion}&zpw_type=${apiType}&nretry=0`;
    return fetch(url, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded,
      redirect: "follow",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        return result.data
          ? JSON.parse(decodeAESwithSecretKey(secretKey, result.data))
          : result;
      })
      .catch((error) => {
        // Xử lý lỗi ở đây nếu cần
        console.error("Fetch error:", error);
        throw error;
      });
  },
};

export default zaloWebApi;
