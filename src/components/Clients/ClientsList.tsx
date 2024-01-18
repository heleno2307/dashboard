import { FC, RefObject } from 'react';
import style from './Clients.module.scss';
import { newDate } from '@/utilities/newDate';
import Client from "../Client/Client"


interface Props {
   clients:ClientType[] | null,
   hendlerClient: (client:Client) => void,
   targetRef: RefObject<HTMLLIElement>
}
type ClientType = {
   TOTAL:number;
   D2_CLIENTE:string;
   NOME:string;
   A1_ULTCOM:string;
   A1_TEL:string;
   A1_EMAIL:string
   A1_LOJA:string
}
const ClientsList:FC<Props> = ({clients,hendlerClient,targetRef})=>{
   return(
      <>
         { clients?.map((el,i) =>(
            clients.length   == i + 1 
               ?
                  <li 
                     className={style.item} 
                     key={i}
                     onClick={()=> hendlerClient(el)}
                     ref={targetRef}
                  >
                     <p>{`${el.D2_CLIENTE.trim()} / ${el.A1_LOJA.trim()}`}</p>
                     <p>{el.NOME.trim()}</p>
                     <p>{el.TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                     <p>{newDate(el.A1_ULTCOM)}</p>
                  </li> 
               :
                  <li 
                     className={style.item} 
                     key={i}
                     onClick={()=> hendlerClient(el)}
                  >
                     <p>{`${el.D2_CLIENTE.trim()} / ${el.A1_LOJA.trim()}`}</p>
                     <p>{el.NOME.trim()}</p>
                     <p>{el.TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                     <p>{newDate(el.A1_ULTCOM)}</p>
                  </li> 
         ))}
      </>
   )
}
export default ClientsList;