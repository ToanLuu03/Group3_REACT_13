// import { instance } from "../instance";

// export const getAll = async (accessToken) => {
//     try {
//         const response = await instance.get('trainer/get-all',
//             {
//                 headers: { Authorization: Bearer ${accessToken} ,
//               }
//         );
//         // console.log(response);

//         return response;
        
//     } catch (error) {
//         console.log(error);
//     }
// }

import { instance } from "../instance"; 

export const getAll = async (token) => {
  try {
    const response = await instance.get(
      "v1/trainer/get-all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(response.data)
    return response;
  } catch (error) {
    console.error("Error fetching trainer data", error);
    throw error; 
  }
};