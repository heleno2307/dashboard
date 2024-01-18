
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {ReactNode} from 'react';
import { useRouter } from "next/router";

type Props = {
   children:ReactNode
}
type UserContext = {
   user:User | null;
   hendlerUser: (code:string,data:Data)=> void;
   logOut: ()=>void
}
type User = {
   code:string;
   data:Data
}
type Data ={
   access_token:string;
   refresh_token:string;
   expires_in:number;
   scope: string;
   token_type:string
}

const userContext = createContext<UserContext | null>(null);

const UserProvider = ({ children }: Props) => {
   const route = useRouter();
   const [user, setUser] = useState<User | null>(null);
   
   //SE USUARIO ATUALIZAR A PAGINA SALVA AS INFORMACOES NOVAMENTE
   useEffect(() => {
      if (user === null) {
         let userSessionString: string | null = sessionStorage.getItem('user');
         if (userSessionString !== null) {
         let userSession: User = JSON.parse(userSessionString);

         setUser({
            code: userSession.code,
            data: userSession.data
         });
        }
      }
   }, [user]);    
   
   //SALVA USUARIO
   const hendlerUser = (code: string, data: Data) => {
      setUser({
         code: code,
         data: data,
      });
   }; 

   // FUNC PARA LOGOUT DO USUARIO
   const logOut = () => {
      setUser(null);
      sessionStorage.clear();
      route.push('/');
   };

   return (
      <userContext.Provider value={{ user, hendlerUser, logOut }}>
         {children}
      </userContext.Provider>
   );
};

const useUserContext = () => {
   const context = useContext(userContext);
   if (!context) {
     throw new Error("useTalks must be used within a TalksProvider");
   }
   return context;
};
 
export {UserProvider,useUserContext}