const spacetime = require('spacetime');

exports.isSameDay = (date1, date2 = new Date()) => (
  date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
);

exports.getToday = () => {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const today = spacetime(now.getTime(), 'Asia/Taipei');

  return today;
};
