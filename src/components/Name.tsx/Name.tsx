import { useToast } from "@/context/toastContext";
import { useUserContext } from "@/context/userContext";
import { useFetch } from "@/hook/useFetch";
import getName from "@/routes/getName";
import capitalizeNames from "@/utilities/capitalizeNames";
import { useCallback, useState } from "react";

type Data = [
   {
      USR_CODIGO:string
   }
]


const Name = ()=>{
   const { user } = useUserContext();
   const [name, setName] = useState('');
   const {showToast} = useToast()

   const hendlerError = (error: unknown) => {
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000);
        setName('Desconhecido');
      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000);
        setName('Desconhecido');
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000);
        setName('Desconhecido');
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000);
        setName('Desconhecido');
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000);
        setName('Desconhecido');
      }
   };


   //REALIZA UMA REQUISICAO PARA PEGAR NOME DO USUARIO
   useFetch(async()=>{
      if(user != null){
         try {
            const data:Data = await getName(user.code);
            checkData(data);
         } catch (error) {
            hendlerError(error)
         }
         
      }
   },[user]);
 
   //REALIZA UMA CHECAGEM NO DADO E TRATA O DADO
   const checkData = (data:Data)=>{
      if(data[0]?.USR_CODIGO){
         const userName = data[0].USR_CODIGO.trim();
         setName(capitalizeNames(userName));
      }
   }
   
   return <h1>Olá {name}</h1>
}
export default Name