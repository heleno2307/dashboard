import { useCallback, useEffect, useState } from 'react';
import styles from './AdminContents.module.scss';
import Name from '../Name.tsx/Name';
import YearsChatSales from '../YearsChartSales/YearsChartSales';
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import SelectSeller from '../SelectSeller/SelectSeller';
import { SellerContextProvider } from '@/context/sellerContext';
import OrderChart from '../OrderChart/OrderChart';




export default function AdminContents(){
   const route = useRouter();
   const {user} = useUserContext()
   
   useEffect(() => {
      if (user && typeof window !== undefined && typeof window !== null) {
        if (!user.admin) {
          route.push("/Dashboard");
        }
      }
    });

   return(
      <section className={styles.content}>
         <Name/>
         <SellerContextProvider>
            <SelectSeller/>
            <YearsChatSales/>
            <OrderChart/>
         </SellerContextProvider>
        
      </section>
   )
}