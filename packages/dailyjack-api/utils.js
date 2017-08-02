const spacetime = require('spacetime');

exports.isSameDay = (date1, date2 = new Date()) => (
  date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
);

exports.getToday = () => {
  const now = spacetime(new Date(), 'Asia/Taipei');
  now.hour(0);
  now.minute(0);
  now.second(0);
  now.millisecond(0);

  return now;
};
