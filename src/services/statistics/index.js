import { instance } from "../instance"

const statistics ={
    moduleStatistics: async(token) => {
        try {
            const response= await instance.get("/v3/statistic/module-statistic",{
                headers:{
                    Authorization:`Bearer ${token}`,

                }
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }
}
export default statistics;