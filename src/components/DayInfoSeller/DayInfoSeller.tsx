import { useCallback, useEffect, useState } from "react";
import DayInfo from "../DayInfo/DayInfo";
import getInitial from "@/routes/get.initial";
import { useUserContext } from "@/context/userContext";
import { useSellerContext } from "@/context/sellerContext";
import { format } from "date-fns";
import { useToast } from "@/context/toastContext";


export default function DayInfoSeller(){
   const [dayInfo,setDayInfo] = useState({})
   const {user} = useUserContext()
   const {seller} = useSellerContext()
   const {showToast} = useToast()

   const hendlerError = useCallback((error: unknown) => {
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000);

      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000);
    
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000);
     
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000);
       
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000);
      }
   },[showToast]);

   const dataFetch = useCallback(async()=>{
      if(!user || !seller) return
      try {
         const date = format(new Date(),'yyyyMMdd')
         const data = await getInitial(user.code,date,date,false,seller.A3_COD)
         setDayInfo(data.DIA)
      } catch (error) {
         hendlerError(error)
      }
   },[user,seller,hendlerError])

   useEffect(()=>{
      dataFetch()
   },[dataFetch])
   
   return(
      <DayInfo initial={dayInfo} seller={seller?.A3_COD ?seller.A3_COD:''}/>
   )
}

