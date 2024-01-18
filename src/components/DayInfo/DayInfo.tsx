import style from './DayInfo.module.scss'
import { MdAttachMoney } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { MdCompareArrows } from "react-icons/md";
import { FiBarChart } from "react-icons/fi";
import {useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";
import Popup from '../Popup/Popup';
import Devolution from '../Devolution/Devoltion';
import { useInitialContext } from '@/context/initialInfoContext';

type Datafetch = {
   MARGEM_DIA:number,
   SD1_TOTAL:number,
   SD2_TOTAL:Number,
   SD2_LIQUIDO:number
}

const DayInfo = ()=>{
   const [status,setStatus] = useState<Datafetch>();
   const [popup,setPopup] = useState(false);
   const {initial} = useInitialContext();

   //PEGA OS DADOS INICIAIS DO CONTEXTO
   useEffect(()=>{
      if(!initial)return
      setStatus(initial.DIA)
   },[initial])

   return(
      <div className={style.main_info}>
         {
            status != null
            ?
               <div className={style.infos}>
                  <div className={style.info}>
                     <p className={style.title}>Valor vendido <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span> </p>
                     <p className={style.value}>{status?.SD2_TOTAL?status.SD2_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'0,00'}</p>
                  </div>
                  <div className={style.divIcon}>
                     <MdAttachMoney className={`${style.dayInfo_icon} ${style.sale}`} />
                  </div>
               </div>
            :
              <div className={style.infos}>
                  <ImSpinner8 className={style.icon_spin}/>
              </div> 
         }
         {
            status != null
            ?
               <div className={style.infos}>
                  <div className={style.info}>
                     <p className={style.title}>Valor liquido <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span> </p>
                     <p className={style.value}>{status?.SD2_LIQUIDO?status.SD2_LIQUIDO.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'0,00'}</p>
                  </div>
                  <div className={style.divIcon}>
                     <MdAttachMoney className={`${style.dayInfo_icon} ${style.sale}`} />
                  </div>
               </div>
            :
              <div className={style.infos}>
                  <ImSpinner8 className={style.icon_spin}/>
              </div> 
         }
         {
            status != null
            ?
               <div className={style.infos}>
                  <div className={style.info}>  
                     <p className={style.title}>Margem <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span></p>
                     <p className={style.value}>{status?.MARGEM_DIA?status.MARGEM_DIA.toFixed(2):'0'}%</p>
                  </div>
                  <div className={style.divIcon}>
                     <FiBarChart className={`${style.dayInfo_icon} ${style.margin_sale}`} />
                  </div>
               </div>
            :
               <div className={style.infos}>
                  <ImSpinner8 className={style.icon_spin}/>
               </div>
         }
         {
            status != null
            ?
               <div 
                  className={`${style.infos} ${style.devolutionDiv}`}
                  onClick={()=> setPopup(true)}
               >
                  <div className={style.info}>
                     <p className={style.title}>Devolução <span><MdArrowForwardIos className={style.dayInfo_iconArrow} /></span></p>
                     <p className={style.value}>{status?.SD1_TOTAL?status.SD1_TOTAL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }):'R$ 0,00'}</p>
                  </div>
                  <div className={style.divIcon}>
                     <MdCompareArrows  className={`${style.dayInfo_icon}  ${style.devolution}`} />
                  </div>
               </div>
            :
              <div className={style.infos}>
                  <ImSpinner8 className={style.icon_spin}/>
              </div> 
         }
         <Popup 
            width={1000}
            state={popup}
            setState={setPopup}
         >
            <Devolution/>
         </Popup>
      </div>
   )
}

export default DayInfo;