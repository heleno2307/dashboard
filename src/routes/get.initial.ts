import axios from "axios";

const getInitil = async (user:string,dateIni:string,dateFim:string,admin:boolean=false) => {
  try {
    const response = await axios.post(`/api/initial/${user}`,{
      dateIni,
      dateFim,
      admin
    });
    return response.data;
  } catch (error:any) {
    return error.response.data;
  }
};

export default getInitil;
