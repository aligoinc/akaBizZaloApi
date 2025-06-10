export const DetailStatusConstant = {
    SUCCESS: { id: 2, name: "Thành công" },
    RECEIVED: { id: 4, name: "Đã nhận" },
    OPENED: { id: 5, name: "Đã mở" },
    CLICKED: { id: 6, name: "Đã click" },
    NOT_EXIST: { id: 13, name: "Không tồn tại" },
    FAIL: { id: 10, name: "Thất bại" },
  };
  
  export const SUCCESS_STATUS = [
    DetailStatusConstant.SUCCESS,
    DetailStatusConstant.RECEIVED,
    DetailStatusConstant.OPENED,
    DetailStatusConstant.CLICKED,
  ];
  
  export const FAIL_STATUS = [DetailStatusConstant.FAIL];
  