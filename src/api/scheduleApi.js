import axios from "axios";

const BASE_URL = "http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1";

const getToken = () => localStorage.getItem("token");

// Fetch schedule
export const fetchSchedule = (account) => {
    return axios.get(`${BASE_URL}/trainer/schedule/${account}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// Fetch schedule detail
export const fetchScheduleDetail = (slotTimeId) => {
    return axios.get(`${BASE_URL}/trainer-management/schedule-detail/${slotTimeId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// Post free time
export const postFreeTime = (data) => {
    return axios.post(`${BASE_URL}/trainer-management/schedule/freetime`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// Get free time
export const getFreeTime = (trainerAccount) => {
    return axios.get(`${BASE_URL}/trainer/free-time?trainerAccount=${trainerAccount}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// Remove slot time
export const removeSlotTime = (slotTimeDayParamId) => {
    return axios.post(`${BASE_URL}/trainer/schedule/remove-slot-time-day/${slotTimeDayParamId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};
