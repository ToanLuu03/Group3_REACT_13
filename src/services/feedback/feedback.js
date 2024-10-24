// src/api.js
export const fetchFeedbackData = async (moduleId, trainerAccount) => {
  try {
    const response = await fetch(
      `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/modules/feedbacks/${moduleId}?trainerAccount=${trainerAccount}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch feedback data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
