
import { useCallback, useEffect, useRef, useState } from 'react';
import style from './Orders.module.scss';
import getCurrentSales from '@/routes/getCurrentSales';
import { useUserContext } from '@/context/userContext';
import { replaceDate } from '@/utilities/replaceDate';
import { getInitialDateOrder } from '@/utilities/getInitialDate';
import { getDate } from '@/utilities/getDate';
import { ImSpinner8 } from "react-icons/im";
import { useDate } from '@/hook/useDate';
import Popup from '../Popup/Popup';
import Itens from '../Itens/Itens';
import Toast from '../Toast/Toast';
import { useAllContext } from '@/context/allContext';
import { OrderList } from './OrdersList';
import getCurrentSalesFilter from '@/routes/getCurrentSalesFilter';
import OrdersFilter from '../OrdersFilter/OrdersFilter';
import { useOrderContext } from '@/context/orderContext';
import OrderInputs from '../OrderInputs/OrderInputs';


const Orders = ()=>{
   const [popup, setPopup] = useState(false);

   const { user } = useUserContext();
   const { all } = useAllContext();

   const {
      sales,
      setOrder,
      setSales,
      hendlerError,
      salesFilter,
      setSalesFilter,
      filter,
      lastPage,
      page,
      dateFimRef,
      dateIniRef,
      setPage,
      setLastPage,
   } = useOrderContext();

   
   const targetRef = useRef<HTMLLIElement>(null);

   useEffect(() => {
      setSalesFilter(sales);
   }, [sales,setSalesFilter])
  
  
   //BUSCA NA API UMA LISTA DE PEDIDOS
   const fetchData = useCallback(async () => {
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
            setPage(dataFetch.next_page);
            setLastPage(() => dataFetch.last_Page);
      
         } 

      } catch (error) {
         // Tratar erro
        hendlerError(error);
      }
   }, [user, all,hendlerError,setSales,setSalesFilter,setPage,setLastPage]);
   
   useEffect(()=>{
      fetchData()
   },[fetchData]);

   const callbackFetch = useCallback(async(
      user:string,
      dateIni:string,
      dateFim:string,
      all:boolean,
      page:number
      )=>{
         try {
            if(filter == 'TD'){
               const data = await getCurrentSales(user,dateIni,dateFim,all,page);
               if(Array.isArray(data?.SC5)){
                  setSales((current:any)=> [...current,...data.SC5]);
                  setPage((current)=> current + 1);      
                  setLastPage(data.last_Page)
               }
   
            }else{
               const data = await getCurrentSalesFilter(user,dateIni,dateFim,filter,all,page);
               if(Array.isArray(data?.SC5)){
                  setSales((current:any)=> [...current,...data.SC5]);
                  setPage((current)=> current + 1);      
                  setLastPage(data.last_Page)
               }
            }
         } catch (error) {
            //tratar erro
            hendlerError(error);
         }
        
   },[filter,hendlerError,setSales,setPage,setLastPage]);

   useEffect(() => {
      if (typeof window !== 'undefined' && user) {
         
         const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
         };
   
         const callback: IntersectionObserverCallback = (entries) => {
            
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
   }, [ user,callbackFetch,all,lastPage,page,dateFimRef,dateIniRef]);
 
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
                  <OrderInputs/>
                  <OrdersFilter/>
              
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
            <Itens/>
         </Popup>
         <Toast/>
      </div>
   )
}

export default Orders;