import { useEffect, useState } from 'react';
import styles from './AdminContents.module.scss';
import dynamic from 'next/dynamic';
import Name from '../Name.tsx/Name';
import YearsChatSales from '../YearsChartSales/YearsChartSales';
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/router';


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
         <YearsChatSales/>  
      </section>
   )
}