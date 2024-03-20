import { useCallback, useEffect } from "react";

export const useFetch = (action:()=>void,dependency:any[]) =>{

   const fetchStatus = useCallback(action,dependency);

   //executa as requisições
   useEffect(()=>{
      fetchStatus()
   },[fetchStatus]);
}