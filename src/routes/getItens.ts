import axios from "axios";

const getItens = async (user:string,filial:string,order:string) => {
  try {
    const response = await axios.post(`/api/orderItem/${user}`,{
      filial,
      order
    });
    return response.data;
  } catch (error:any) {
    return error.response.data;
  }
};

export default getItens;
