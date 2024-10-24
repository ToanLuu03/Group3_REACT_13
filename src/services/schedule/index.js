// api.js
import axios from "axios";

export const fetchTrainerSchedule = (trainerAccount) => {
  return axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/schedule/${trainerAccount}`);
};

export const fetchTrainerFreeTime = (trainerAccount) => {
  return axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/free-time?trainerAccount=${trainerAccount}`);
};
