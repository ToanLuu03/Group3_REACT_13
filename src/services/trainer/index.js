import { instance } from "../instance";

const TrainerAPI = {
  
  getscheduleNonReport: async (token) => {
    try {
      const response = await instance.get(
        "v1/trainers/trainer-report/get-schedule-non-report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching schedule non-report:", error.message);
      return null;
    }
  },
/*************  ✨ Codeium Command 🌟  *************/
  trainersReportHistory: async (token) => {
    try {
      const response = await instance.get("v1/trainers/reports-history-v2", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching schedule report:", error.message);
    }
  },
/******  e790a642-456a-4782-989e-6445d5287153  *******/
  scheduleReport: async (token, formData) => {
    try {
      const response = await instance.post("v1/trainers/reports", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {}
  },
  gettrainerInfo: async (token, username) => {
    try {
      const response = await instance.get(`v1/trainer/get-info/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching trainer info:", error.message);
    }
  },
  updateTrainerInfo: async (token, username, data) => {
    try {
      const response = await instance.put(
        `v1/trainer/update-trainer/${username}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating trainer info:", error.message);
    }
  },
  trainerConfirmation: async(username,token) => {
    try {
      const response = await instance.get(`v1/trainer/confirm-module/get-list-class/${username}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  getScheduleByClass : async(token, classId) => {
    try {
      const response = await instance.get(`v3/trainers/trainer-report/get-schedule-by-class?classID=${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },
};
export default TrainerAPI;
