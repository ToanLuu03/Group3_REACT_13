import axios from "axios";

export const fetchClassDistribution = async (account, startDate, endDate) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/statistics/class-distribution?account=${account}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw new Error("Failed to fetch Class Distribution Data");
  }
};

export const fetchClassStatus = async (account, startDate, endDate) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/statistics/class-status-ratio?startDate=${startDate}&endDate=${endDate}&account=${account}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw new Error("Failed to fetch Class Status Data");
  }
};
