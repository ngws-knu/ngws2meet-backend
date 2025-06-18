const SLOT = 900;
const generateAvailability = (start_date, end_date, start_time, end_time) => {
  //create array of unix time
  const user_time_array = create_user_time_array_hr(
    start_date,
    end_date,
    start_time,
    end_time
  );

  // create objects of unix time with count set to 0
  const user_time = new Object();
  for (let i = 0; i < user_time_array.length; i++) {
    const timeslot = user_time_array[i];
    user_time[timeslot] = [];
  }
  return user_time;
};

const create_user_time_array_hr = (start_date, end_date, start_time, end_time) => {
  const arr = [];

  const dayStartUnix = new Date(start_date).getTime() / 1000; // 00:00:00
  const dayEndUnix   = new Date(end_date).getTime()   / 1000;
  const daysDiff     = (dayEndUnix - dayStartUnix) / 86400;   // 일수 차이

  const startOffset = secondsConverter(start_time); // 09:00 → 32400
  const endOffset   = secondsConverter(end_time);   // 17:00 → 61200

  for (let i = 0; i <= daysDiff; i++) {
    const base = dayStartUnix + 86400 * i;          // 해당 날짜 자정
    const first = base + startOffset;               // 09:00
    const last  = base + endOffset;            // 17:00

    for (let ts = first; ts < last; ts += SLOT) {
      arr.push(ts);                        
    }
  }
  return arr;
};

//Convert "HH:MM" time format to seconds
const secondsConverter = (time) => {
  const hour   = parseInt(time.slice(0, 2)) * 3600;
  const minute = parseInt(time.slice(3, 5)) * 60;
  //   const second = parseInt(time.slice(6, 8));
  const sum = hour + minute;
  return sum;
};

const IDGenerator = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};

const retrievePage = function (
  object,
  currentPage,
  daysPerPage,
  start_time,
  end_time
) {
  const numberOfElementsPerPage =
    daysPerPage * hrs_per_day(start_time, end_time);
  const startIndex = (currentPage - 1) * numberOfElementsPerPage;
  const endIndex = startIndex + numberOfElementsPerPage;
  const objectArray = Object.getOwnPropertyNames(object);
  if (endIndex > objectArray.length) {
    const difference = endIndex - objectArray.length;
    return objectArray.slice(startIndex, startIndex + difference);
  }
  return objectArray.slice(startIndex, Math.min(endIndex, objectArray.length));
};
const hrs_per_day = (start_time, end_time) => {
  const s = secondsConverter(start_time);
  const e = secondsConverter(end_time);
  return Math.floor((e - s) / 900) + 1;
};
module.exports = { generateAvailability, IDGenerator, retrievePage };