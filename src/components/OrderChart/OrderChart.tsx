import dynamic from 'next/dynamic';
import styles from './OrderChart.module.scss'
import { ApexOptions } from "apexcharts";
import { useCallback, useEffect, useState } from 'react';
import getCountOrder from '@/routes/getCountOrder';
import { useUserContext } from '@/context/userContext';
import { useSellerContext } from '@/context/sellerContext';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useToast } from '@/context/toastContext';
const Chart = dynamic(() => import("react-apexcharts"), {
   ssr: false,
});

interface DataFecth{
   total_order:number,
   total_deleted:number
}
export default function OrderChart(){
   const [order,setOrder] = useState<number[]>([])
   const [month,setMonth] = useState<number>(new Date().getMonth() + 1 )
   const [year,setYear] = useState<number>(new Date().getFullYear());
   const [loading,setLoading] = useState(true);
   const {user} = useUserContext()
   const {seller} = useSellerContext()
   const {showToast} = useToast()

   const dataFecth = useCallback(async()=>{
      if(!user || !seller || typeof window === 'undefined') return
      try {
         const formatedMonth = month <= 9?`0${month}`:month
         const data:DataFecth = await getCountOrder(
            user.code,
            seller.A3_COD,
            `${year}${formatedMonth}01`,
            `${year}${formatedMonth}31`
         )
         setOrder([data.total_order,data.total_deleted]);
         setLoading(true);
      } catch (error) {
         if (error === 404) {
            showToast('erro', 'Error 02, contactar administrador', 4000);
            setOrder([])
          } else if (error === 500) {
            showToast('erro', 'Error 03, contactar administrador', 4000);
            setOrder([])
          } else if (error === 401) {
            showToast('erro', 'Error 04, contactar administrador', 4000);
            setOrder([])
          } else if (error === 402) {
            showToast('erro', 'Error 01, contactar administrador', 4000);
            setOrder([])
          } else {
            showToast('erro', 'Error 05, contactar administrador', 4000);
            setOrder([])
          }
      }
   },[seller,user,month,year,showToast]);

   useEffect(()=>{
      dataFecth()
   },[dataFecth])

   const hendlerPlusDate = ()=>{
     if(loading && order.length != 0){
         setLoading(false)
         if(month == 12){
            setMonth(1);
            setYear((current)=> current +1 )
         }else{
            setMonth((curent)=> curent + 1)
         }
     }
   }
   const hendlerMinusDate = ()=>{
      if(loading && order.length != 0){
         setLoading(false);
         if(month == 1){
            setMonth(12);
            setYear((current)=> current - 1 )
         }else{
            setMonth((curent)=> curent - 1)
         }
      }
   }
   
   const options:ApexOptions = {
      chart:{
         id: 'donut-chart'
      },
      colors: ["#0191CE", "#F37020"],
      labels:['Pedidos N/Excluídos','Pedidos Excluídos'],
      dataLabels: {
         enabled: true,
         formatter: function (val:number) {
           return val.toFixed(2) + "%"
         },
      },
      plotOptions: {
         pie: {
           expandOnClick:true
         }
       },
      
   }
   return(
      <div className={styles.content}>
         <h3>Percentual de pedidos Excluídos</h3>
         <div className={styles.years}>
            <IoIosArrowBack className={styles.icon} onClick={hendlerMinusDate}/>
            {`${month} - ${year}`}
            <IoIosArrowForward className={styles.icon} onClick={hendlerPlusDate}/>
         </div>
         <div className={styles.chart}>
            {
               typeof window !== 'undefined' &&(
                  <Chart options={options} series={order} type='donut'width={450}/>
               )
            }
         </div>
      </div>
   )
}