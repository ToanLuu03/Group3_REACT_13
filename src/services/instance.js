import axios from "axios";

export const instance = axios.create({
  baseURL: "https://fams-app.ap-southeast-2.elasticbeanstalk.com/api",
});

instance.interceptors.response.use(function (response) {
  return response.data;

});
