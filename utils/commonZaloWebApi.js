import CryptoJS from "crypto-js";
import md5 from "md5";

export function getSignKey(e, t) {
  let a = [];
  for (let n in t) t.hasOwnProperty(n) && a.push(n);
  a.sort();
  let s = "zsecure" + e;
  for (let n = 0; n < a.length; n++) s += t[a[n]];
  return md5(s);
}

export function encodeAES(e, t, a, s, n = 0) {
  if (!t) return null;
  try {
    {
      const n = "hex" == a ? CryptoJS.enc.Hex : CryptoJS.enc.Base64,
        i = CryptoJS.enc.Utf8.parse(e),
        o = {
          words: [0, 0, 0, 0],
          sigBytes: 16,
        },
        r = CryptoJS.AES.encrypt(t, i, {
          iv: o,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).ciphertext.toString(n);
      return s ? r.toUpperCase() : r;
    }
  } catch (o) {
    return (
      console.log("ParamCipher err", o),
      n < 3 ? encodeAES(e, t, a, s, n + 1) : null
    );
  }
}

export function decodeAES(e, t, a, s = 0) {
  if (!t) return null;
  try {
    t = decodeURIComponent(t);
    {
      const s = CryptoJS.enc.Utf8.parse(e);
      return (
        (a = a
          ? C.a.enc.Hex.parse(a)
          : {
              words: [0, 0, 0, 0],
              sigBytes: 16,
            }),
        CryptoJS.AES.decrypt(
          {
            ciphertext: CryptoJS.enc.Base64.parse(t),
            salt: "",
          },
          s,
          {
            iv: a,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        ).toString(CryptoJS.enc.Utf8)
      );
    }
  } catch (n) {
    return (
      console.log("ParamDecryptor err", n),
      s < 3 ? encodeAES(e, t, a, s + 1) : null
    );
  }
}

export function encodeAESwithSecretKey(secretKey, e, t = 0) {
  try {
    let t = CryptoJS.enc.Base64.parse(secretKey);
    return CryptoJS.AES.encrypt(e, t, {
      iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext.toString(CryptoJS.enc.Base64);
  } catch (n) {
    return t < 3 ? encodeAESwithSecretKey(secretKey, e, t + 1) : null;
  }
}

export function decodeAESwithSecretKey(secretKey, e, t = 0) {
  try {
    e = decodeURIComponent(e);
    let t = CryptoJS.enc.Base64.parse(secretKey);
    const n = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(e),
        salt: "",
      },
      t,
      {
        iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);
    return n;
  } catch (n) {
    return t < 3 ? decodeAESwithSecretKey(secretKey, e, t + 1) : null;
  }
}

export function randomString(e, t) {
  const a = e || 6,
    s = t && t > e ? t : 12;
  let n = Math.floor(Math.random() * (s - a + 1)) + a;
  if (n > 12) {
    let e = "";
    for (; n > 0; )
      (e += Math.random()
        .toString(16)
        .substr(2, n > 12 ? 12 : n)),
        (n -= 12);
    return e;
  }
  return Math.random().toString(16).substr(2, n);
}

function processStr(e) {
  if (!e || "string" != typeof e)
    return {
      even: null,
      odd: null,
    };
  const [t, a] = [...e].reduce((e, t, a) => (e[a % 2].push(t), e), [[], []]);
  return {
    even: t,
    odd: a,
  };
}

export function createEncryptKey(e = 0, zcid, zcid_ext) {
  let encryptKey;
  const t = (e, t) => {
    const { even: a } = processStr(e),
      { even: s, odd: n } = processStr(t);
    if (!a || !s || !n) return !1;
    const i =
      a.slice(0, 8).join("") +
      s.slice(0, 12).join("") +
      n.reverse().slice(0, 12).join("");
    return (encryptKey = i), !0;
  };
  if (!zcid || !zcid_ext)
    return (
      console.log("ParamCipher error: didn't create zcid and zcid_ext yet"), !1
    );
  try {
    let a = null;
    a = CryptoJS.MD5(zcid_ext).toString().toUpperCase();
    if (!t(a, zcid) && e < 3) return createEncryptKey(e + 1, zcid, zcid_ext);
  } catch (a) {
    return (
      console.log("ParamCipher error: create encrypt key", a),
      e < 3 && createEncryptKey(e + 1, zcid, zcid_ext)
    );
  }
  return encryptKey || !0;
}
