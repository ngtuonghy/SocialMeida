import moment from "moment";

// Thời gian hiện tại
export const formatTime = (time) => {
  const currentTime = moment();

  // Thời gian bạn muốn định dạng (ví dụ: từ cơ sở dữ liệu)
  const databaseTime = moment(time);
  // console.log(currentTime);
  // console.log("time database", databaseTime);
  // Tính khoảng thời gian giữa currentTime và databaseTime
  // const timeDifference = moment.duration(currentTime.diff(databaseTime));

  // Định dạng thời gian dưới dạng chuỗi tương tự Facebook
  const formattedTime = moment(databaseTime).fromNow();
  return formattedTime;
  // console.log(formattedTime); // Ví dụ: "3 giờ trước"
};
export const formatTime2 = (time) => {
  if (time) {
    const databaseTime = moment(time);
    moment.updateLocale("en", {
      relativeTime: {
        future: "in %s",
        past: "%s ",
        s: "1 s",
        ss: "%d s",
        m: "1 m",
        mm: "%d m",
        h: "1 h",
        hh: "%d h",
        d: "1 d",
        dd: "%d d",
        w: "1 w",
        ww: "%d w",
        M: "1 month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      },
    });
    return databaseTime.fromNow();
  }
  return "";
};
