import axios, { AxiosError } from "axios";

const getDevolution = async (user:string,date:string,admin:boolean) => {
  try {
    const response = await axios.post(`/api/devolution/${user}`,{
      date:date,
      admin
    });
    return response.data;
  }catch (e: unknown) {
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

export default getDevolution;
