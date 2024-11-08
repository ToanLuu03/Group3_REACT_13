import { instance } from "../instance";

export const fetchDataGPA = async ( token ) => {
    try {
      const response = await instance.get("v1/trainer-management/portal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching schedule non-report:", error.message);
      return null;
    }
  };