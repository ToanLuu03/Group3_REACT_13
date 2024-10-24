import axios from "axios";

const BASE_URL = "https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1";

export const fetchSchedule = (account) => {
    return axios.get(`${BASE_URL}/trainer/schedule/${account}`);
};

export const fetchScheduleDetail = (slotTimeId) => {
    return axios.get(`${BASE_URL}/trainer-management/schedule-detail/${slotTimeId}`)
}

export const postFreeTime = (data) => {
    return axios.post(`${BASE_URL}/trainer-management/schedule/freetime`, data);
};

export const getFreeTime = (trainerAccount) => {
    return axios.get(`${BASE_URL}/trainer/free-time?trainerAccount=${trainerAccount}`);
};

export const removeSlotTime = (slotTimeDayParamId) => {
    return axios.post(`${BASE_URL}/trainer/schedule/remove-slot-time-day/${slotTimeDayParamId}`);
};
