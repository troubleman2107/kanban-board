Date.prototype.getMonthName = function () {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[this.getMonth()];
};

export const convertDate = (date) => {
  var date = new Date(date);
  date.getDate();
  const month_Name = new Date().getMonthName();
  return `${month_Name} ${date.getDate()}`;
};
