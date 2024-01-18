
import { createContext, useContext, useState } from "react";
import {ReactNode} from 'react';
import { useFetch } from "@/hook/useFetch";
import { useUserContext } from "./userContext";
import getInitil from "@/routes/get.initial";
import { getInitialDate } from "@/utilities/getInitialDate";
import { getDate } from "@/utilities/getDate";
import { ImSpinner8 } from "react-icons/im";
import style from './initial.module.scss'
import Toast from "@/components/Toast/Toast";
import { useToast } from "./toastContext";
import { useAllContext } from "./allContext";

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

   useFetch(async () => {
      if (!user) return;
      try {
         const data = await getInitil(user.code, getInitialDate(), getDate(),all);
         if(data.SD2){
            setInitial(data);
         }else if( data && data.erro){
            console.log('erro')
            showToast('info','Erro 02, contactar administrador',4000)
         }

         
      } catch (error) {
         console.log(error)
      }
   }, [user, setInitial,all]);

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
     throw new Error("useTalks must be used within a TalksProvider");
   }
   return context;
};
 
export {InitialProvider,useInitialContext}