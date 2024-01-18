import axios from "axios";

const getClient = async (user:string,loja:string,client:string,admin:boolean) => {
  try {
    const response = await axios.post(`/api/client/${loja}/${user}/${client}`,{
      admin
    });
    return response.data;
  } catch (e:any) {
    return e.response;
  }
};

export default getClient;
