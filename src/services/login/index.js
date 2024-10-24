import { instance } from "../instance";

export const loginFAMS = async (username, password) => {
  try {
    const response = await instance.post('test/loginToFAMS', {
      username: username,
      password: password
    });
    
    // Store tokens in localStorage
    // localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response;
  } catch (error) {
    console.log(error);
  }
};
