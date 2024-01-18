import axios from "axios";

const getCurrentSalesFilter = async (user:string,dateIni:string,dateFim:string,filter:string,admin:boolean = false,page:number =1,limit:number=15) => {
  try {
    const response = await axios.post(`/api/salesFilter/${user}`,{
      dateIni,
      dateFim,
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

export default getCurrentSalesFilter;
