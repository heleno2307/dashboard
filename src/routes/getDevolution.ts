import axios from "axios";

const getDevolution = async (user:string,date:string,admin:boolean) => {
  try {
    const response = await axios.post(`/api/devolution/${user}`,{
      date:date,
      admin
    });
    return response.data;
  } catch (error:any) {
    return error.response.data;
  }
};

export default getDevolution;
