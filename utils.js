const SLOT = 900;
const generateAvailability = (start_date, end_date, start_time, end_time) => {

  const user_time_array = create_user_time_array_hr(
    start_date,
    end_date,
    start_time,
    end_time
  );


  const user_time = new Object();
  for (let i = 0; i < user_time_array.length; i++) {
    const timeslot = user_time_array[i];
    user_time[timeslot] = [];
  }
  return user_time;
};

const create_user_time_array_hr = (start_date, end_date, start_time, end_time) => {
  const arr = [];

  const dayStartUnix = new Date(start_date).getTime() / 1000; 
  const dayEndUnix   = new Date(end_date).getTime()   / 1000;
  const daysDiff     = (dayEndUnix - dayStartUnix) / 86400;  

  const startOffset = secondsConverter(start_time);
  const endOffset   = secondsConverter(end_time); 

  for (let i = 0; i <= daysDiff; i++) {
    const base = dayStartUnix + 86400 * i;       
    const first = base + startOffset;            
    const last  = base + endOffset;        

    for (let ts = first; ts < last; ts += SLOT) {
      arr.push(ts);                        
    }
  }
  return arr;
};


const secondsConverter = (time) => {
  const hour   = parseInt(time.slice(0, 2)) * 3600;
  const minute = parseInt(time.slice(3, 5)) * 60;

  const sum = hour + minute;
  return sum;
};

const IDGenerator = function () {
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
