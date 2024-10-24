// src/api.js
export const fetchModuleData = async (moduleId, token) => {
    try {
      const response = await fetch(
        `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/module/get-info/${moduleId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch module details");
      }
  
      const result = await response.json();
      return result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  