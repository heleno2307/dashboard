
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {ReactNode} from 'react';
import { useUserContext } from "./userContext";
import { getInitialDate } from "@/utilities/getInitialDate";
import { getDate } from "@/utilities/getDate";
import { ImSpinner8 } from "react-icons/im";
import style from './initial.module.scss'
import Toast from "@/components/Toast/Toast";
import { useToast } from "./toastContext";
import { useAllContext } from "./allContext";
import getInitial from "@/routes/get.initial";

type Props = {
   children:ReactNode
}
type InitialContext = {
   initial:Initial
}
type Initial = {
   SD1:{
      D1_DTDIGIT:string,
      D1_TOTAL:number
   }[],
   SD2:{
      D2_TOTAL:number,
      D2_CUSTO1:number,
      D2_EMISSAO:string
   }[],
   MES:{
      MARGEM_MES:number,
      SD1_TOTAL:number
      SD2_TOTAL:Number
   }
   DIA:{
      MARGEM_DIA:number,
      SD1_TOTAL:number,
      SD2_TOTAL:Number,
      SD2_LIQUIDO:number
   }

}


const initialContext = createContext<InitialContext | null>(null);

const InitialProvider = ({ children }: Props) => {
   const { user } = useUserContext();
   const [initial, setInitial] = useState<Initial | null>(null);
   const {showToast} = useToast()
   const {all} = useAllContext()

   const fetchData = useCallback(async () => {
      if (!user) return;
      try {
         const data = await getInitial(user.code, getInitialDate(), getDate(),all);
         if(data.SD2){
            setInitial(data);
         }

      } catch (error) {
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
      }
   }, [user, setInitial,all,showToast]);

   useEffect(()=>{
      fetchData();
   },[fetchData])

   // Se 'initial' ainda for null, você pode decidir o que fazer neste ponto
   if (initial === null) {
      return (
         <>
            <div className={style.divInitial}>
               <ImSpinner8 className={style.icon_spin}/> 
               <Toast/>
            </div>
         </>
         
      ); 
   }

   return (
      <initialContext.Provider value={{ initial }}>
         {children}
      </initialContext.Provider>
   );
};
const useInitialContext = () => {
   const context = useContext(initialContext);
   if (!context) {
     throw new Error("useInitialContext must be used within a initialContext");
   }
   return context;
};
 
export {InitialProvider,useInitialContext}