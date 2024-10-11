import axios from 'axios';

export const fetchModuleInfo = () => {
  return axios.get("https://6703d4b1ab8a8f892731d45c.mockapi.io/api/v1/trainer/module/get-info/272/AnhPC1_test/Moduleinfo");
};

