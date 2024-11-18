import axios from "axios";

export const instance = axios.create({
  baseURL: "https://fams.ap-southeast-1.elasticbeanstalk.com/api",
});

instance.interceptors.response.use(function (response) {
  return response.data;

});
