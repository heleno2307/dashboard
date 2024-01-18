import { useFetch } from "@/hook/useFetch";
import style from "./Itens.module.scss";
import { useUserContext } from "@/context/userContext";
import getItens from "@/routes/getItens";
import { useState } from "react";
import limitarCaracteres from "@/utilities/limitarCaracteres";
import { ImSpinner8 } from "react-icons/im";
import { useToast } from "@/context/toastContext";

type Prop = {
   order:{
      order:string|null,
      filial:string|null
   }|null;
} 
type SC6 = {
   C6_ITEM:string;
   C6_PRODUTO:string;
   C6_PRCVEN:number
   C6_VALOR:number
   C6_TES:string
   C6_QTDVEN:number
   B1_DESC:string
}
const Itens =({order}:Prop)=>{
   const {user}=useUserContext();
   const [itens, setItens]= useState<SC6[]|null>(null)
   const {showToast} = useToast()

   useFetch (async()=>{
      if(!user || !order?.filial || !order?.order)return;

      try {
         const data = await getItens(user.code, order.filial, order.order);
         if(Array.isArray(data)){
            setItens(data);
         }else if(data && data.erro){
            showToast('info','Erro 07, contactar o administrador',4000);
         }
         
      } catch (error) {
         console.log(error);
      }
     
   },[user]);

   if(!itens){
      return(
         <section className={style.load}>
            <ImSpinner8 className={style.icon_spin}/>
         </section>
      )
   }

   return(
      <section className={style.container}>
         <div className={style.title}>
            <h2>Itens do Pedido</h2>
         </div>
            <div className={style.header}>
               <p className={style.titles}>Item</p>
               <p className={style.titles}>Codigo</p>
               <p className={style.titles}>Descrição</p>
               <p className={style.titles}>Quantidade</p>
               <p className={style.titles}>Valor Unitário</p>
               <p className={style.titles}>Valor Total</p>
               <p className={style.titles}>Tipo de Saída</p>

            </div>
            <ul className={style.list}>
               {
                  itens?.map((el,i)=>(
                     <li className={style.item} key={i}>
                        
                        <p className={style.itens}>{el.C6_ITEM}</p>
                        <p className={style.itens}>{el.C6_PRODUTO.trim()}</p>
                        <p className={style.itens}>{limitarCaracteres(el.B1_DESC.trim(),25)}</p>
                        <p className={style.itens}>{el.C6_QTDVEN}</p>
                        <p className={style.itens}>{el.C6_PRCVEN.toFixed(2)}</p>
                        <p className={style.itens}>{el.C6_VALOR.toFixed(2)}</p>
                        <p className={style.itens}>{el.C6_TES}</p>
                     </li>
                  ))
               }
            </ul>
               
      </section>
   )

}
export default Itens;