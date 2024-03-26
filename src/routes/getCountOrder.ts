import axios, { AxiosError } from "axios";

const getCountOrder = async (user:string,seller:string,dateIni:string,dateFim:string) => {
  try {
    const response = await axios.post(`/api/countOrder/${user}`,{
      seller,
      dateFim,
      dateIni
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

export default getCountOrder;
