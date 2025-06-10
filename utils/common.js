import sharp from "sharp";

export const sleep = (timeMs) =>
  new Promise((resolve) => setTimeout(resolve, timeMs));

export const getDateNow = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now;
};

export const verifyGroupLink = (link) => {
  if (!link) return null;
  if (link.includes("facebook.com")) {
    link = link
      .replace("www.facebook.com", "mbasic.facebook.com")
      .replace("web.facebook.com", "mbasic.facebook.com")
      .replace("m.facebook.com", "mbasic.facebook.com")
      .replace("mobile.facebook.com", "mbasic.facebook.com");
    if (!link.includes("mbasic.facebook.com"))
      link = link.replace("facebook.com", "mbasic.facebook.com");
    if (!link.includes("http")) link = "https://" + link;
    return link;
  } else return `https://mbasic.facebook.com/${link}`;
};

export const verifyProfileLink = (link) => {
  if (!link) return null;
  if (link.includes("facebook.com")) {
    link = link
      .replace("www.facebook.com", "mbasic.facebook.com")
      .replace("web.facebook.com", "mbasic.facebook.com")
      .replace("m.facebook.com", "mbasic.facebook.com")
      .replace("mobile.facebook.com", "mbasic.facebook.com");
    if (!link.includes("mbasic.facebook.com"))
      link = link.replace("facebook.com", "mbasic.facebook.com");
    if (!link.includes("http")) link = "https://" + link;
    if (link.includes("profile.php?id="))
      link = link.replace("profile.php?id=", "").split("&")[0];
    link = link.split("?")[0];
    return link;
  } else return `https://mbasic.facebook.com/${link}`;
};

function retainOnlyDigits(str) {
  if (!str) return str;
  let res = "";
  for (let i = 0; i < str.length; i++) {
    let c = str.charAt(i);
    if (c >= "0" && c <= "9") {
      res += c;
    }
  }
  return res;
}

export function verifyPhone(phone) {
  try {
    phone = phone?.toString();
    if (!phone?.trim()) return "";

    phone = retainOnlyDigits(phone);

    // Xét ngoại lệ đầu số nước ngoài
    if (
      (phone.length === 11 || phone.length === 12) &&
      !phone.startsWith("0") &&
      !phone.startsWith("84")
    ) {
      return phone;
    }
    if (
      phone.length === 10 &&
      !phone.startsWith("0") &&
      !phone.startsWith("1") &&
      !phone.startsWith("84")
    ) {
      return phone;
    }
    // Xét ngoại lệ đầu số 084 với định dạng 84xxxxxxx => trả về 084xxxxxxx
    if (phone.length === 9 && phone.startsWith("84")) return "0" + phone;

    let _dau_0 = phone.substring(0, 1);
    let _dau_84 = phone.substring(0, 2);
    let _dau_840 = phone.substring(0, 3);

    if (_dau_0 === "0") {
      phone = "84" + phone.substring(1);
    } else if (_dau_840 === "840") {
      phone = "84" + phone.substring(3);
    } else if (_dau_840 === "+84") {
      phone = phone.substring(1);
    } else if (
      _dau_0 !== "0" &&
      _dau_84 !== "84" &&
      _dau_840 !== "840" &&
      _dau_840 !== "+84"
    ) {
      phone = "84" + phone;
    }

    let _list_dau_so_moi = [
      "8470",
      "8479",
      "8477",
      "8476",
      "8478",
      "8483",
      "8484",
      "8485",
      "8481",
      "8482",
      "8432",
      "8433",
      "8434",
      "8435",
      "8436",
      "8437",
      "8438",
      "8439",
      "8456",
      "8458",
      "8459",
    ];

    let _list_dau_so_cu = [
      "84120",
      "84121",
      "84122",
      "84126",
      "84128",
      "84123",
      "84124",
      "84125",
      "84127",
      "84129",
      "84162",
      "84163",
      "84164",
      "84165",
      "84166",
      "84167",
      "84168",
      "84169",
      "84186",
      "84188",
      "84199",
    ];

    let _dau_cu_84 = phone.substring(0, 5);
    for (let _i = 0; _i < 21; _i++) {
      if (_dau_cu_84 === _list_dau_so_cu[_i]) {
        phone = _list_dau_so_moi[_i] + phone.substring(5);
        if (phone.length !== 11) return "";
        return "0" + phone.substring(2);
      }
    }

    if (phone.length !== 11) return "";

    return "0" + phone.substring(2);
  } catch (ex) {
    console.log("Lỗi khi verify sđt: " + ex);
    return "";
  }
}

export const getDateTimeNow = () => {
  return getDateNow().toISOString().slice(0, 16).replace("T", " ");
};

export const downloadImageAndConvertToBase64 = async (url) => {
  try {
    // Tải ảnh từ URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download image");
    }

    // Chuyển đổi dữ liệu ảnh thành base64
    const blob = await response.blob();
    const base64 = await convertBlobToBase64(blob);

    return base64;
  } catch (error) {
    console.error("Error:", error);
    // Xử lý lỗi ở đây nếu cần
  }
};

function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = reject;

    // Đọc dữ liệu ảnh dưới dạng base64
    reader.readAsDataURL(blob);
  });
}

export const dataURItoBlob = (dataURI) => {
  const binary = atob(dataURI);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
};

//Function that inserts an array of File objects inside a input type file, because HTMLInputElement.files cannot be setted directly
export const FileListItems = (file_objects) => {
  const new_input = new ClipboardEvent("").clipboardData || new DataTransfer();
  for (let i = 0, size = file_objects.length; i < size; ++i) {
    new_input.items.add(file_objects[i]);
  }
  return new_input.files;
};

export const getRandomArray = (arr, count) => {
  try {
    var list = arr.slice(); // Tạo bản sao của mảng để tránh thay đổi mảng gốc
    var res = [];

    for (var i = 0; i < count; i++) {
      if (list.length === 0) {
        break;
      }
      var randomIndex = Math.floor(Math.random() * list.length);
      res.push(list[randomIndex]);
      list.splice(randomIndex, 1);
    }

    return res;
  } catch (error) {
    console.log(error);
    return arr;
  }
};

export const addImageToInput = async (url, inp) => {
  const data = await downloadImageAndConvertToBase64(url);
  //Create a Blob object
  const blob = dataURItoBlob(data);
  //Use the Blob to create a File Object
  const file = new File([blob], "img.png", {
    type: "image/png",
    lastModified: new Date().getTime(),
  });
  //Putting the File object inside an array because my input is multiple
  const array_images = [file]; //You can add more File objects if your input is multiple too
  //Modify the input content to be submited
  inp.files = new FileListItems(array_images);
};

export const distinctObjectArray = (array, prop) => {
  return array.filter((item, index, self) => {
    return index === self.findIndex((t) => t[prop] === item[prop]);
  });
};

export const replaceVocative = (content, gender) => {
  try {
    if (!content?.trim()) return content;
    if (gender == "Nam")
      return content
        ?.replaceAll("[vocative_web]", "anh")
        .replaceAll("[Vocative_web]", "Anh")
        .replaceAll("[VOCATIVE_WEB]", "ANH");
    else if (gender == "Nữ")
      return content
        ?.replaceAll("[vocative_web]", "chị")
        .replaceAll("[Vocative_web]", "Chị")
        .replaceAll("[VOCATIVE_WEB]", "CHỊ");
    else
      return content
        ?.replaceAll("[vocative_web]", "")
        .replaceAll("[Vocative_web]", "")
        .replaceAll("[VOCATIVE_WEB]", "");
  } catch (error) {
    console.log(error);
    return content;
  }
};

export function removeEmoji(text) {
  if (!text?.trim()) return "";
  return text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
}

export const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  return str;
};

export const normalizeContent = (content, isLowerCase = true) => {
  try {
    if (!content) return content;
    content = content.trim();
    if (isLowerCase) content = content.toLowerCase();
    while (content.includes("  ")) content = content.replaceAll("  ", " ");
    return content;
  } catch (error) {
    console.log(error);
    return content;
  }
};

export const removeSpecialCharacters = (str) => {
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ""
  );
  return str;
};

export const getInfoImageFromUrl = async (url) => {
  try {
    // Fetch the image and get its metadata
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    
    // Return image dimensions similar to what Image would provide
    return {
      width: metadata.width,
      height: metadata.height,
      url
    };
  } catch (error) {
    console.error("Có lỗi khi lấy kích thước ảnh:", error);
    throw error;
  }
};

export const urlToBlob = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
};

export const sortByTextProperty = (a, b, property) => {
  const textA = removeVietnameseTones(a[property].toLowerCase());
  const textB = removeVietnameseTones(b[property].toLowerCase());
  if (textA < textB) {
    return -1;
  }
  if (textA > textB) {
    return 1;
  }
  // names must be equal
  return 0;
};
