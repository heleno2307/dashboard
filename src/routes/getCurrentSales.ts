import axios from "axios";

const getCurrentSales = async (user:string,dateIni:string,dateFim:string,admin:boolean = false,page:number =1,limit:number=15) => {
  try {
    const response = await axios.post(`/api/currentSales/${user}`,{
      dateIni,
      dateFim,
      admin,
      page,
      limit
    });
    return response.data;
  } catch (e:any) {
    return e.response.data;
  }
};

export default getCurrentSales;
