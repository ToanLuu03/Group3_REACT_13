import axios from 'axios';

export const fetchModuleInfo = () => {
  return axios.get("https://fams.ap-southeast-1.elasticbeanstalk.com/api/v1/trainer/module/get-info/272/AnhPC1_test/Moduleinfo");
};

