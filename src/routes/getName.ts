import axios from "axios";

const getName = async (user:string) => {
  try {
    const response = await axios.post(`/api/name/${user}`);
    return response.data;
  } catch (error:any) {
    return error.response;
  }
};

export default getName;
