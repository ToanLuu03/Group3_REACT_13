import { instance } from "../instance";

// Fetch the trainer's schedule
export const fetchTrainerSchedule = (trainerAccount, token) => {
  return instance.get(`/v1/trainer/schedule/${trainerAccount}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch the trainer's free time
export const fetchTrainerFreeTime = (trainerAccount, token) => {
  return instance.get(`/v1/trainer/free-time?trainerAccount=${trainerAccount}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Save the trainer's free time
export const saveTrainerFreeTime = (data, token) => {
  return instance.post('/v1/trainer-management/schedule/freetime', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Fetch schedule details by ID
export const fetchScheduleDetails = (eventId, token) => {
  return instance.get(`/v1/trainer-management/schedule-detail/${eventId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

