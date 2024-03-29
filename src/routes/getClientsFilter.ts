import axios, { AxiosError } from "axios";

const getClientsFilter = async (user:string,admin:boolean=false,filter:string,page:number=1,limit:number=15) => {
  try {
    const response = await axios.post(`/api/clientsFilter/${user}`,{
      admin,
      page,
      limit,
      filter
    });
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const axiosError = e as AxiosError;
      if (axiosError.response?.status === 404) {
        // Rejeitar a Promise com o valor 404
        return Promise.reject(404);
      }else if(axiosError.response?.status == 500){
        return Promise.reject(500);
      }else if(axiosError.response?.status == 401){
        return Promise.reject(401)
      }else if(axiosError.response?.status == 402){
        return Promise.reject(402);
      }
    } else {
      console.error("Erro desconhecido:", e);
      return null;
    }
  }
};

export default getClientsFilter;
