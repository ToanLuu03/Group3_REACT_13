import { instance } from "../instance";

const TrainerAPI = {
  getscheduleNonReport: async (token) => {
    try {
      const response = await instance.get(
        "trainers/trainer-report/get-schedule-non-report",
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
  trainersReportHistory: async (token) => {
    try {
      const response = await instance.get("trainers/reports-history-v2", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching schedule report:", error.message);
    }
  },
  scheduleReport: async (token, formData) => {
    try {
      const response = await instance.post("trainers/reports", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {}
  },
  gettrainerInfo: async (token, username) => {
    try {
      const response = await instance.get(`trainer/get-info/${username}`, {
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
        `trainer/update-trainer/${username}`,
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
      const response = await instance.get(`trainer/confirm-module/get-list-class/${username}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};
export default TrainerAPI;
