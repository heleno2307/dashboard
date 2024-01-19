import { useFetch } from '@/hook/useFetch';
import style from './Devolution.module.scss';
import { useUserContext } from '@/context/userContext';
import getDevolution from '@/routes/getDevolution';
import { getDate } from '@/utilities/getDate';
import { useRef, useState } from 'react';
import { newDate } from '@/utilities/newDate';
import { replaceDate } from '@/utilities/replaceDate';
import { ImSpinner8 } from 'react-icons/im';
import { useToast } from '@/context/toastContext';
import { useAllContext } from '@/context/allContext';

type CurrentDevolution = {
   D1_FILIAL:string;
   D1_DOC:string;
   D1_TOTAL:number;
   D2_DOC:string;
   D2_EMISSAO:string;
   A1_NOME:string;
   C5_VEND1:string;
   A3_NOME:string
}

const Devolution = ()=>{
   const {user} = useUserContext();
   const [devolution,setDevolution] = useState<CurrentDevolution[] | null>(null)
   const [date, setDate] = useState<string>(getDate());
   const dateRef = useRef<HTMLInputElement>(null);
   const {showToast} = useToast()
   const {all} = useAllContext()

   //FAZ UMA REQUISIÇÃO PARA OBTER AS DEVOLUCOES DETALHADAS
   useFetch(async () => {
      if (!user) return;
      try {
         const data = await getDevolution(user.code, replaceDate(getDate()),all);
         if (Array.isArray(data)) {
            setDevolution(data);
         }
      } catch (error) {
         //tratar error
         if (error === 404) {
            showToast('erro', 'Error 02, contactar administrador', 4000);
            setDevolution([])
         } else if (error === 500) {
            showToast('erro', 'Error 03, contactar administrador', 4000);
            setDevolution([])
         } else if (error === 401) {
            showToast('erro', 'Error 04, contactar administrador', 4000);
            setDevolution([])
         } else if (error === 402) {
            showToast('erro', 'Error 01, contactar administrador', 4000);
            setDevolution([])
         } else {
            showToast('erro', 'Error 05, contactar administrador', 4000);
            setDevolution([])
         }
      }
   }, [user,all]);
   

   //AO ALTERAR DATA REALIZA A REQUISICAO NOVAMENTE
   const hendlerDate = async () => {
      if (!user || !dateRef.current?.value) return;
   
      const dateFim: string = replaceDate(dateRef.current.value);
      const saveData = devolution;
   
      try {
         setDevolution(null);
         const data = await getDevolution(user.code, dateFim,all);
   
         if (Array.isArray(data)) {
            setDevolution(data);
         } else if (data && data.erro) {
            setDevolution(saveData);
            showToast('info', 'Erro 01, contactar o administrador', 4000);
         } else {
            console.log('entrou');
         }
      } catch (error) {
         //tratar error
      }
   };
   
   
   return(
      <>
            <div className={style.title}>
               <h2>Devoluções</h2>
            </div>
            <section className={style.content}>
               <div className={style.inputDiv}>
                  <input 
                     type="date" 
                     className={style.inputDate}
                     name="" 
                     id=""
                     value={date}
                     ref={dateRef}
                     onChange={(e)=> setDate(e.target.value)}
                     onBlur={hendlerDate}
                  />
               </div>
               <div className={style.header}>
                  <p>Filial</p>
                  <p>Nota Devolução</p>
                  <p>Nota Original</p>
                  <p>Total</p>
                  <p>Data Venda</p>
                  <p>Nome Cliente</p>
               </div>
               <ul className={style.list_devolution}>
                 {
                  devolution != null
                  ?
                     devolution?.map((el,i)=>(
                        <li 
                           className={style.item_list}
                           key={i}
                        >
                           <p>{el.D1_FILIAL}</p>
                           <p>{el.D1_DOC}</p>
                           <p>{el.D2_DOC}</p>
                           <p>{el.D1_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                           <p>{newDate(el.D2_EMISSAO)}</p>
                           <p>{el.A1_NOME}</p>
                        </li>
                     ))
                  :
                  <ImSpinner8 className={style.icon_spin}/>
                 }
               </ul>
            </section>
        
      </>
   )
}
export default Devolution