import style from './LastSales.module.scss';
import { MdArrowForwardIos, MdAttachMoney, MdCompareArrows } from "react-icons/md";  // Corrigido aqui
import { FiBarChart } from "react-icons/fi";
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '@/context/userContext';
import { ImSpinner8 } from "react-icons/im";
import { getInitialDate } from '@/utilities/getInitialDate';
import { getDate } from '@/utilities/getDate';
import { newDate } from '@/utilities/newDate';
import { replaceDate } from '@/utilities/replaceDate';
import { useDate } from '@/hook/useDate';
import { useFetch } from '@/hook/useFetch';
import { useInitialContext } from '@/context/initialInfoContext';
import getInitil from '@/routes/get.initial';
import Toast from '../Toast/Toast';
import { useToast } from '@/context/toastContext';
import { useAllContext } from '@/context/allContext';


type MonthlySale = {
   D2_TOTAL:number;
   D2_CUSTO1:number;
   D2_EMISSAO:string
}

type DevolutionMonthly = {
   TOTAL:number;
   D1_DTDIGIT:string
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

const LastSales = ()=>{
   const {user} = useUserContext();
   const {initial} = useInitialContext();
   const dateIniRef = useRef<HTMLInputElement>(null);
   const dateFimRef = useRef<HTMLInputElement>(null);
   const [dateIni, setDateIni] = useState<string>(getInitialDate());
   const [dateFim, setDateFim] = useState<string>(getDate());
   const [infos,setInfos] = useState<Initial | null>();
   const {showToast} = useToast()
   const {all} = useAllContext()
  
   //SETA OS DADOS RETORNADO CONTEXTO PARA OBTER OS DADOS INICIAIS
   useEffect(()=>{
      if(!initial)return;
      setInfos(initial)
   },[initial]);


   //ATUALIZA AS DATAS DAS REFS
   useDate(dateIniRef,dateFimRef,dateIni,dateFim);

   //ao inputs serem alterados, a func faz uma requisição conforme as 
   // as datas recebidas nos inputs
   const hendlerDate = async()=>{
      if(!user || !dateFimRef.current?.value || !dateIniRef.current?.value) return
      const dateini:string = replaceDate(dateIniRef.current.value);
      const dateFim:string = replaceDate(dateFimRef.current.value);
      const saveData = infos;
      setInfos(null);
      
      try {
         const data = await getInitil(user.code,dateini,dateFim,all);
         if(data.SD2){
            setInfos(data);
         }else if(data.erro){
            setInfos(saveData);
            showToast('info','Erro 03, contactar o administrador',4000)
         }
        

      } catch (error) {
         console.log(error);
      }  
   }
   
   return(
      <>
         {infos?.SD1?
               <div className={style.main_saler}>
                  <div className={style.title}>
                     <h2>Vendas mensais</h2>
                  </div>
                  <div className={style.content}>
                     <div className={style.seler_left}>
                        <ul className={style.list_seler}>
                           {infos?.SD2.map((el,i)=>(
                              <li key={i}>
                                 <p className={style.date_list}>{newDate(el.D2_EMISSAO)}</p>
                                 <div className={style.div_values}>
                                    <p className={style.value_list}>+ {el.D2_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    {infos.SD1.map((sd1,index)=>(
                                       sd1.D1_DTDIGIT == el.D2_EMISSAO?<p key={index} className={style.value_list_devolution}>- {sd1.D1_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>:null
                                    ))}
                                 </div>                                 
                              </li>
                           ))}                           
                        </ul>
                     </div>
                   <div className={style.seler_right}>
                        <div className={style.inputDate_div}>
                           <input 
                              type="date" 
                              name="dataini" 
                              id="" 
                              value={dateIni}                       
                              className={style.date} 
                              ref={dateIniRef}
                              onChange={(e)=> setDateIni(e.target.value)}
                              onBlur={hendlerDate} 
                           />
                           <input 
                              type="date" 
                              name="datefim" 
                              id=""
                              value={dateFim}
                              className={style.date} 
                              ref={dateFimRef}
                              onChange={(e)=> setDateFim(e.target.value)}
                              onBlur={hendlerDate}
                           />
                        </div>
                        <div className={style.infos}>
                           <div className={style.info}>
                              <p className={style.title}>Valor liquido <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span> </p>
                              <p className={style.value}>{infos?.MES.SD2_TOTAL?infos.MES.SD2_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'R$ 0,00'}</p>
                           </div>
                           <div className={style.divIcon}>
                              <MdAttachMoney className={`${style.dayInfo_icon} ${style.sale}`} />
                           </div>
                        </div>
                        <div className={style.infos}>
                           <div className={style.info}>  
                              <p className={style.title}>Margem <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span></p>
                              <p className={style.value}>{infos?.MES.MARGEM_MES?infos.MES.MARGEM_MES.toFixed(2):0}%</p>
                           </div>
                           <div className={style.divIcon}>
                              <FiBarChart className={`${style.dayInfo_icon} ${style.margin_sale}`} />
                           </div>
                        </div>
                        <div className={style.infos}>
                           <div className={style.info}>
                              <p className={style.title}>Devolução <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span></p>
                              <p className={style.value}>{infos?.MES.SD1_TOTAL?infos.MES.SD1_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'R$ 0,00'}</p>
                           </div>
                           <div className={style.divIcon}>
                              <MdCompareArrows  className={`${style.dayInfo_icon}  ${style.devolution}`} />
                           </div>
                        </div>
                     </div>
                </div>
             </div>
         :
           <div className={style.main_saler}>
               <ImSpinner8 className={style.icon_spin}/> 
           </div>
               
         }
         <Toast/>
      </>
   )
}
export default LastSales