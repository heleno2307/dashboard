
import { useCallback, useEffect, useRef, useState } from 'react';
import style from './Orders.module.scss';
import getCurrentSales from '@/routes/getCurrentSales';
import { useUserContext } from '@/context/userContext';
import { replaceDate } from '@/utilities/replaceDate';
import { getInitialDateOrder } from '@/utilities/getInitialDate';
import { getDate } from '@/utilities/getDate';
import { ImSpinner8 } from "react-icons/im";
import { useDate } from '@/hook/useDate';
import { useFetch } from '@/hook/useFetch';
import Popup from '../Popup/Popup';
import Itens from '../Itens/Itens';
import Toast from '../Toast/Toast';
import { useToast } from '@/context/toastContext';
import { useAllContext } from '@/context/allContext';
import { OrderList } from './OrdersList';
import getCurrentSalesFilter from '@/routes/getCurrentSalesFilter';
import getInputFilter from '@/routes/getInputFilter';


type Sales = {
   C5_NOMECLI:string;
   C5_CLIENTE:string;
   C5_CONDPAG:string;
   E4_DESCRI:string;
   C5_NOTA:string;
   C5_EMISSAO:string;
   C5_ZSTSOSS:string;
   C5_FILIAL:string;
   C5_ZSEPARA:string;
   C5_ZHORA:string;
   C6_VALOR:number;
   USR_CODIGO:string
   C5_NUM:string;
   C5_ZVERSAO:string
   C5_TRANSP:String
}
type Order = {
   filial:string|null,
   order:string|null
}

const Orders = ()=>{
   const { user } = useUserContext();
   const { showToast } = useToast()
   const { all } = useAllContext()

   const dateIniRef = useRef<HTMLInputElement>(null);
   const dateFimRef = useRef<HTMLInputElement>(null);
   const targetRef = useRef<HTMLLIElement>(null);

   const [sales, setSales] = useState<Sales[] | null>()
   const [salesFilter, setSalesFilter] = useState<Sales[] | null>();
   const [dateIni, setDateIni] = useState<string>(getInitialDateOrder());
   const [dateFim, setDateFim] = useState<string>(getDate());
   const [popup, setPopup] = useState(false)
   const [order, setOrder] = useState<Order | null>(null)
   const [page, setPage] = useState(1);
   const [lastPage, setLastPage] = useState(0);
   const [filter,setFilter] = useState('TD')
   const [filterInput,setFilterInput] = useState<string>('')
   

   

   useEffect(() => {
      setSalesFilter(sales);
   }, [sales])
  
  
   //BUSCA NA API UMA LISTA DE PEDIDOS
   useFetch(async () => {
      if (!user) return;
      try {
        const dataFetch = await getCurrentSales(
            user.code,
            replaceDate(getInitialDateOrder()),
            replaceDate(getDate()),
            all
        );
  
        if (Array.isArray(dataFetch.SC5)) {
            setSales(dataFetch.SC5);
            setSalesFilter(dataFetch.SC5);
            setPage(dataFetch.next_page)
            setLastPage(()=> dataFetch.last_Page)
        } else if (dataFetch && dataFetch.erro) {
            showToast('info',dataFetch.erro,4000);
        }
      } catch (error) {
         console.log(error);
      }
   }, [user, all]);
   
   const callbackFetch = useCallback(async(
      user:string,
      dateIni:string,
      dateFim:string,
      all:boolean,
      page:number
      )=>{
         if(filter == 'TD'){
            const data = await getCurrentSales(user,dateIni,dateFim,all,page);
            if(Array.isArray(data?.SC5)){
               setSales((current:any)=> [...current,...data.SC5]);
               setPage((current)=> current + 1);      
               setLastPage(data.last_Page)
            }else if(data.erro && data){
               showToast('info',data.erro,4000);
            }
         }else{
            const data = await getCurrentSalesFilter(user,dateIni,dateFim,filter,all,page);
            if(Array.isArray(data?.SC5)){
               setSales((current:any)=> [...current,...data.SC5]);
               setPage((current)=> current + 1);      
               setLastPage(data.last_Page)
               console.log(data)
            }else{
   
            }
         }
        
   },[filter,showToast]);

   useEffect(() => {
      if (typeof window !== 'undefined' && user) {
         

         const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
         };
   
         const callback: IntersectionObserverCallback = (entries, observer) => {
            
            entries.forEach((entry) => {
               if(!dateFimRef.current?.value || !dateIniRef.current?.value) return;

               if (entry.isIntersecting) {

                  if (lastPage > page && user) {
                     callbackFetch(
                        user.code,
                        replaceDate(dateIniRef.current.value),
                        replaceDate(dateFimRef.current.value),
                        all,
                        page
                     );
                     
                  }
               }
            });
         };
   
         const observer = new IntersectionObserver(callback, options);
         const currentTarget = targetRef.current;
   
         if (currentTarget) {
            observer.observe(currentTarget);
         }
   
         return () => {
            if (currentTarget) {
               observer.unobserve(currentTarget);
            }
         };
      }
   }, [ user,callbackFetch,all,lastPage,page]);
 
  
   //ATUALIZA AS DATAS DAS REFS 
   useDate(dateIniRef,dateFimRef,dateIni,dateFim);

   // FILTRO PEDIDOS PENDENTE DE CONFIRMACAO
   const hendlerFilter = async(filter:string) => {
      if(!user || !dateFimRef.current?.value || !dateIniRef.current?.value) return
      const dateini:string = replaceDate(dateIniRef.current.value);
      const dateFim:string = replaceDate(dateFimRef.current.value);
      const saveData = sales;
      setSales(null);
      setSalesFilter(null);
      if(filter == "TD"){
         try {
            const data = await getCurrentSales(user.code,dateini,dateFim,all);
            console.log(data)
            if(Array.isArray(data.SC5)){
               setSales(data.SC5);
               setSalesFilter(data.SC5);
               setPage(()=> !data.next_page?1:data.next_page)
               setLastPage(()=> !data.last_Page?0:data.last_Page)
            }else if(data && data.erro){
               showToast('info',data.erro,4000);
               setSales(saveData);
               setSalesFilter(saveData);
            }
         } catch (error) {
            console.log(error);
         }
      }else{
         try {
            const data = await getCurrentSalesFilter(user.code,dateini,dateFim,filter,all);
            console.log(data)
            if(Array.isArray(data.SC5)){
               setSales(data.SC5);
               setSalesFilter(data.SC5);
               setPage(()=> !data.next_page?1:data.next_page)
               setLastPage(()=> !data.last_Page?0:data.last_Page)
            }else if(data && data.erro){
               showToast('info',data.erro,4000);
               setSales(saveData);
               setSalesFilter(saveData);
            }
         } catch (error) {
            console.log(error);
         }
      }
    
   };

   const hendlerFilterInput =async(filterInput:string)=>{
      if(!user || !dateFimRef.current?.value || !dateIniRef.current?.value) return
      if(filterInput.trim() == ''){
         hendlerFilter(filter);
         return;
      }
      const dateini:string = replaceDate(dateIniRef.current.value);
      const dateFim:string = replaceDate(dateFimRef.current.value);
      const saveData = sales;
      setSales(null);
      setSalesFilter(null);

      try {
         const data = await getInputFilter(user.code,dateini,dateFim,filterInput,all);
         console.log(data)
         if(Array.isArray(data.SC5)){
            setSales(data.SC5);
            setSalesFilter(data.SC5);
            setPage(()=> !data.next_page?1:data.next_page)
            setLastPage(()=> !data.last_Page?0:data.last_Page)
         }else if(data && data.erro){
            showToast('info',data.erro,4000);
            setSales(saveData);
            setSalesFilter(saveData);
         }
      } catch (error) {
         console.log(error);
      }
   }
       
   const hendlerDate = async()=>{
      if(!user || !dateFimRef.current?.value || !dateIniRef.current?.value) return;
      
      const dateini:string = replaceDate(dateIniRef.current.value);
      const dateFim:string = replaceDate(dateFimRef.current.value);
      const saveData = sales;
      setSales(null);
      setSalesFilter(null);
      try {
         const data = await getCurrentSales(user.code,dateini,dateFim,all);

         if(Array.isArray(data.SC5)){
            setSales(data.SC5);
            setSalesFilter(data.SC5);
            setPage(data.next_page)
            setLastPage(()=> data.last_Page)
         }else if(data && data.erro){
            showToast('info',data.erro,4000);
            setSales(saveData);
            setSalesFilter(saveData);
         }
      } catch (error) {
         console.log(error);
      }
     
      
   }

 
   return(
      <div className={style.main_order}>
         {
            salesFilter == null  
            ? 
               <ImSpinner8 className={style.icon_spin}/> 
            : 
               <>
                  <div className={style.main_title}>
                     <h2 className={style.title}>Pedidos</h2>
                  </div>
                  <div className={style.order_date}>
                     <input 
                        type="date" 
                        name="" 
                        id=""
                        className={style.input_date_order}
                        value={dateIni}
                        ref={dateIniRef}
                        onChange={(e) => setDateIni(e.target.value)}
                        onBlur={hendlerDate} 
                     />
                     <input 
                        type="date" 
                        name="" 
                        id=""
                        className={style.input_date_order}
                        value={dateFim}
                        ref={dateFimRef}
                        onChange={(e) => setDateFim(e.target.value)}
                        onBlur={hendlerDate} 
                     />
                     <input 
                        type="text" 
                        placeholder='Filtor' 
                        className={style.input_date_order}
                        value={filterInput} 
                        onChange={(e)=> setFilterInput( e.target.value)}
                        onKeyDown={(e)=>{
                           if(e.key == 'Enter'){
                              hendlerFilterInput(filterInput);
                           }
                        }}
                     />
                  </div>
                  <div className={style.main_status}>
                     <div className={style.order_status}>
                        <label htmlFor="ADD" className={style.label_order}>Pendente de Separação</label>
                        <input 
                           type="radio" 
                           name="status" 
                           id="ADD"
                           className={style.input_radio} 
                           onChange={()=>{
                              setFilter('ADD')
                              hendlerFilter('ADD')
                           }}
                           value="ADD"
                           checked={filter == "ADD"}
                        />
                     </div>
                     <div className={style.order_status}>
                        <label htmlFor="SPD" className={style.label_order}>Confirmados</label>
                        <input 
                           type="radio" 
                           name="status" 
                           id="SPD"
                           className={style.input_radio}
                           onChange={()=>{
                              setFilter('SPD')
                              hendlerFilter('SPD')
                           }}
                           value="SPD"
                           checked={filter == "SPD"}
                        />
                     </div>
                     <div className={style.order_status}>
                        <label htmlFor="SPN" className={style.label_order}>Pedente de Confirmação</label>
                        <input 
                           type="radio" 
                           name="status" 
                           id="SPN"
                           checked={filter == "SPN"}
                           className={style.input_radio}
                           onChange={()=>{
                              setFilter('SPN')
                              hendlerFilter('SPN')
                           }}
                           value="SPN"
               
                        />
                     </div>
                     <div className={style.order_status}>
                        <label htmlFor="TD" className={style.label_order}>Todos</label>
                        <input 
                           type="radio" 
                           name="status" 
                           id="TD"
                           className={style.input_radio}
                           onChange={()=>{
                              setFilter('TD')
                              hendlerFilter('TD')
                           }}
                           checked={filter == "TD"}  
                           value="TD"
                   
                        />
                     </div>
                     <div className={style.order_status}>
                        <label htmlFor="NF" className={style.label_order}>Nfe</label>
                        <input 
                           type="radio" 
                           name="status" 
                           id="NF"
                           className={style.input_radio}
                           onChange={()=>{
                              setFilter('NF')
                              hendlerFilter('NF')
                           }}
                           value="NF"
                           checked={filter == "NF"}
             
                        />
                     </div>
                  </div>
              
                  <div className={style.header}>
                     <p>Emissao</p>
                     <p>Filial</p>
                     <p>Numero Pedido</p>
                     <p>Cliente</p>
                     <p>total</p>
                     <p>Envio</p>
                     <p>Status Separação</p>
                     <p>Nfe</p>
                  </div>
                  <ul className={style.orders}>
                     <OrderList targetRef={targetRef}salesFilter={salesFilter} setOrder={setOrder} setPopup={setPopup}/>
                  </ul>
               </>
         }
         <Popup 
            width={1000}
            setState={setPopup}
            state={popup}
         >
            <Itens order={order}/>
         </Popup>
         <Toast/>
      </div>
   )
}

export default Orders;