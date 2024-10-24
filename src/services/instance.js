import axios from "axios";

export const instance = axios.create({
  baseURL: "https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/",
});

instance.interceptors.response.use(function (response) {
  return response.data;

});
