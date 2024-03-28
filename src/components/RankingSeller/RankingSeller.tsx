import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import styles from './RankingSeller.module.scss'
import { useCallback, useEffect, useState } from "react";
import getSellerMonthSales from "@/routes/getSellerMonthSales";
import { useUserContext } from "@/context/userContext";
import capitalizeNames from "@/utilities/capitalizeNames";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbMath1Divide2 } from "react-icons/tb";


interface SD{
   nome:string,
   ano:string,
   mes:string,
   total:number
}
interface DataFetch{
   SD1: SD[],
   SD2: SD[]
}


const Chart = dynamic(() => import("react-apexcharts"), {
   ssr: false,
});
 
function RankingSeller() {
   const [sellers,setSellers] = useState<string[]>([])
   const [sd2,setSd2] = useState<number[]>([])
   const [sd1,setSd1] = useState<number[]>([]);
   const [month,setMonth] = useState<number>(new Date().getMonth() + 1 )
   const [year,setYear] = useState<number>(new Date().getFullYear());
   const [avarage,setAvarage] = useState(false)
   const [loading,setLoading] = useState(true);

   const {user} = useUserContext()

   const dataFetch = useCallback(async()=>{
      if(!user)return
      try {
         const formatedMonth = month <= 9?`0${month}`:month
         const data:DataFetch = await getSellerMonthSales(
            user.code,
            `${year}${formatedMonth}01`,
            `${year}${formatedMonth}31`
         );
         setSellers(()=>{
            return data.SD2.map((el)=>{
               const partesNome = el.nome.split(' ')
               const nome = `${partesNome[0]} ${partesNome[partesNome.length - 1]}`
               
               return capitalizeNames(nome)
            })
         });
         setSd2(()=>{
            return data.SD2.map((el)=>{
               return parseInt(el.total.toString())
            })
         })
         setSd1(()=>{
            return data.SD1.map((el)=>{
               return parseInt(el.total.toString())
            })
         })
         setLoading(true);
      } catch (error) {
         
      }
   },[user,month,year])

   useEffect(()=>{
      dataFetch()
   },[dataFetch])

   const hendlerPlusDate = ()=>{
     if(loading){
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
      if(loading){
         setLoading(false);
         if(month == 1){
            setMonth(12);
            setYear((current)=> current - 1 )
         }else{
            setMonth((curent)=> curent - 1)
         }
      }
   }
   const hendlerClickAvarage = ()=>{
      if(!avarage){
        setSd2((current)=>{
          return current.map((el)=>{
            return el / 20
          })
        })
        setAvarage(true)
      }else{
        setSd2((current)=>{
          return current.map((el)=>{
            return el * 20
          })
        })
        setAvarage(false)
      }
   }
   const options: ApexOptions = {
      chart: {
        id: "seller"
      },
      dataLabels:{
        enabled:false
      },
      xaxis: {
        categories: sellers,
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(val);
          },
        },
      },
      colors: ["#0191CE", "#F37020"],
      responsive: [
        {
           breakpoint: 1200,
           options:{
              chart:{
                 width:800
              }
           }
        },
        {
           breakpoint: 962,
           options:{
              chart:{
                 width:600
              }
           }
        }
      ],
      
      
   };
   const series = [
      {
        name: "Vendas",
        data: sd2,
      },
      {
         name: "Devoluções",
         data: sd1,
      },
   ];
   return ( 
      <section className={styles.contentChart}>
         <h3>Gráfico de vendedores</h3>
         <div className={styles.years}>
            <IoIosArrowBack className={styles.icon} onClick={hendlerMinusDate}/>
            {`${month} - ${year}`}
            <IoIosArrowForward className={styles.icon} onClick={hendlerPlusDate}/>
         </div>
         <div className={styles.iconsChartDiv}>
            <TbMath1Divide2 
               className={`${styles.iconsChart} ${avarage? styles.active :null}`}
               onClick={hendlerClickAvarage}
            />
         </div>
         <Chart 
            options={options} 
            series={series} 
            height={400} 
            width={1000}
            type="bar"
         />
      </section>
    );
}

export default RankingSeller;