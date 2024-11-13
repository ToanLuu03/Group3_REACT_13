import axios from "axios";

export const fetchTrainerSchedule = (trainerAccount, token) => {
  return axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/schedule/${trainerAccount}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const fetchTrainerFreeTime = (trainerAccount, token) => {
  return axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/free-time?trainerAccount=${trainerAccount}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
