import axios from "axios";


const getUser = async (user: string, password: string) => {
  try {
    const response = await axios.post(`http://rochapecas.ddns.net:8085/PROTHEUS/REST/api/oauth2/v1/token?grant_type=password&username=${user}&password=${password}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export default getUser;
