function formatDate(timestamp, includeTime = true) {
  let date = new Date(timestamp);

  // Lấy giờ
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Xác định AM/PM
  let ampm = hours >= 12 ? "PM" : "AM";

  // Chuyển đổi giờ sang 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Giờ '0' phải thành '12'

  // Đảm bảo phút luôn có 2 chữ số
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Lấy các thành phần ngày, tháng, năm
  let day = date.getDate();
  let month = date.getMonth() + 1; // Tháng tính từ 0-11, cần cộng thêm 1
  let year = date.getFullYear();

  // Đảm bảo ngày và tháng luôn có 2 chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Return with or without time based on the includeTime parameter
  if (includeTime) {
    return `${hours}:${minutes} ${ampm} | ${day}/${month}/${year}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}
export default formatDate;