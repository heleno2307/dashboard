import axios from "axios";

const getClientsFilter = async (user:string,admin:boolean=false,filter:string,page:number=1,limit:number=15) => {
  try {
    const response = await axios.post(`/api/clientsFilter/${user}`,{
      admin,
      page,
      limit,
      filter
    });
    return response.data;
  } catch (e:any) {
    return e.response.data;
  }
};

export default getClientsFilter;
