import { useUserContext } from "@/context/userContext";
import { useFetch } from "@/hook/useFetch";
import getName from "@/routes/getName";
import capitalizeNames from "@/utilities/capitalizeNames";
import { useState } from "react";

type Data = [
   {
      USR_CODIGO:string
   }
]


const Name = ()=>{
   const { user } = useUserContext();
   const [name, setName] = useState('');

   //REALIZA UMA REQUISICAO PARA PEGAR NOME DO USUARIO
   useFetch(async()=>{
      if(user != null){
         try {
            const data:Data = await getName(user.code);
            checkData(data);
         } catch (error) {
            console.log(error)
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