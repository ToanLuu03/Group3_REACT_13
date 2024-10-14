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
