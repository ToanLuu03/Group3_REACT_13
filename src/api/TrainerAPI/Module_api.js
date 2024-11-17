import axios from 'axios';

export const fetchModuleInfo = () => {
  return axios.get("http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/module/get-info/272/AnhPC1_test/Moduleinfo");
};

