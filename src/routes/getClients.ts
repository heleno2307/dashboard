import axios from "axios";

const getClients = async (user:string,admin:boolean=false,page:number=1,limit:number=15) => {
  try {
    const response = await axios.post(`/api/clients/${user}`,{
      admin,
      page,
      limit
    });
    return response.data;
  } catch (e:any) {
    return e.response.data;
  }
};

export default getClients;
