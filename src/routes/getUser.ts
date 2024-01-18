import axios from "axios";
import dotenv from 'dotenv'
dotenv.config();

const getUser = async (user:string, password:string) => {
  try {
    const response = await axios.post(`${process.env.API_LOGIN}grant_type=password&username=${user}&password=${password}`,);
    return response.data;
  } catch (error:any) {
    return error.response;
  }
};

export default getUser;
