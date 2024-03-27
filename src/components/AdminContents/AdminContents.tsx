import { useCallback, useEffect, useState } from 'react';
import styles from './AdminContents.module.scss';
import Name from '../Name.tsx/Name';
import YearsChatSales from '../YearsChartSales/YearsChartSales';
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import SelectSeller from '../SelectSeller/SelectSeller';
import { SellerContextProvider } from '@/context/sellerContext';
import OrderChart from '../OrderChart/OrderChart';
import DayInfoSeller from '../DayInfoSeller/DayInfoSeller';
import { ToastProvider } from '@/context/toastContext';
import { AllProvider } from '@/context/allContext';
import { IoMdRefresh } from 'react-icons/io';
import style from './AdminContents.module.scss'
import RankingSeller from '../RankingSeller/RankingSeller';



export default function AdminContents(){
   const [refresh, setRefresh] = useState(true);
   const route = useRouter();
   const {user} = useUserContext()

   const handleRefresh = () => {
      setRefresh(false);
  
      // Após um curto período, define novamente como true para forçar a re-renderização
      setTimeout(() => {
        setRefresh(true);
      }, 50);
   };

   useEffect(() => {
   }, [refresh]);
 
   
   useEffect(() => {
      if (user && typeof window !== undefined && typeof window !== null) {
        if (!user.admin) {
          route.push("/Dashboard");
        }
      }
   });

   return(
      <section className={styles.content}>
         <ToastProvider>
            <AllProvider>
               <div className={style.header}>
                  <Name/>
                  <IoMdRefresh onClick={handleRefresh} className={style.icon}/>
               </div>
               
               
               <SellerContextProvider>
                  <DayInfoSeller/>
                  <SelectSeller/>
                  <YearsChatSales/>
                  <OrderChart/>
               </SellerContextProvider>
            </AllProvider>
         </ToastProvider>
      </section>
   )
}