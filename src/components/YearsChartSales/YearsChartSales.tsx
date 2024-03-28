import { useCallback, useEffect, useState } from "react";
import styles from "./YearsChartSales.module.scss";
import getSalesYears from "@/routes/getYearsSales";
import { useUserContext } from "@/context/userContext";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useSellerContext } from "@/context/sellerContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiBarChart } from "react-icons/fi";
import { TbMath1Divide2 } from "react-icons/tb";
import { MdShowChart } from "react-icons/md";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DataFetch {
  SD1: SD1[];
  SD2: SD2[];
  lengthDate: number;
  months: string[];
}
interface SD1 {
  mes: string;
  ano: string;
  total: number;
}
interface SD2 {
  mes: string;
  ano: string;
  total: number;
}

export default function YearsChatSales() {
  const [sd2, setSd2] = useState<number[]>([]);
  const [sd1, setSd1] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const [avarage,setAvarage] = useState(false)
  const [charType,setChartType] = useState<'bar' | 'line'>('bar');
  const [year,setYear] = useState(new Date().getFullYear())
  const [loading,setLoading] = useState(false);
  const { user } = useUserContext();
  const {seller} = useSellerContext()

  const fetchData = useCallback(async () => {
    if (!user || typeof window === "undefined" || !seller) return;

    const dataMes: DataFetch = await getSalesYears(
      user.code,
      seller.A3_COD,
      `${year}0101`,
      `${year}1231`
    );
    
    const sd2Data: number[] = new Array(dataMes.lengthDate).fill(0);
    const sd1Data: number[] = new Array(dataMes.lengthDate).fill(0);

    dataMes.SD2.forEach((item: SD2) => {
      const index = dataMes.months.indexOf(`${item.mes} ${item.ano}`);

      if(index !== -1){
        sd2Data[index] = parseInt(item.total.toString());
      }
      
    });

    dataMes.SD1.forEach((item: SD1) => {
      const index = dataMes.months.indexOf(`${item.mes} ${item.ano}`);
      if(index !== -1){
        sd1Data[index] = parseInt(item.total.toString());
      }
    });

    setSd2(sd2Data);
    setSd1(sd1Data);
    setMeses(dataMes.months);
    setLoading(false)
    setAvarage(false)
  }, [user,seller,year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const hendlerClickAlterTypeChart = ()=>{
      if(charType == 'bar'){
        setChartType('line')
      }else{
        setChartType('bar')
      }
  }
  const hendlerClickAvarage = ()=>{
    if(!avarage){
      setSd2((current)=>{
        return current.map((el)=>{
          return el / 20
        })
      })
      setSd1((current)=>{
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
      setSd1((current)=>{
        return current.map((el)=>{
          return el * 20
        })
      })
      setAvarage(false)
    }
    
  }
  const options: ApexOptions = {
    chart: {
      id: "basic"
    },
    dataLabels:{
      enabled:false
    },
    xaxis: {
      categories: meses,
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
    <section className={styles.sectionContent}>
      <h3>Vendas Anuais</h3>
      <div className={styles.years}>
        <IoIosArrowBack className={styles.icon} onClick={()=>{
          if(!loading){
            setLoading(true);
            setYear((curent)=> curent - 1)
          }
        }}/>
        {year}
        <IoIosArrowForward className={styles.icon} onClick={()=>{
          if(!loading){
            setLoading(true);
            setYear((curent)=> curent + 1)
          }
        }}/>
      </div>
      <div className={styles.iconsChartDiv}>
          <FiBarChart 
            className={`${styles.iconsChart} ${charType == 'bar'? styles.active :null}`}
            onClick={hendlerClickAlterTypeChart}
          />
          <MdShowChart 
            className={`${styles.iconsChart} ${charType == 'line'? styles.active :null}`}
            onClick={hendlerClickAlterTypeChart}
          />
          <TbMath1Divide2 
            className={`${styles.iconsChart} ${avarage? styles.active :null}`}
            onClick={hendlerClickAvarage}
          />
      </div>
      {
         charType == 'bar' &&(
            <Chart
              options={options}
              series={series}
              type="bar"
              width={"1000"}
              height={"400px"}
            />
         )
      }
      {
         charType == 'line' &&(
            <Chart
              options={options}
              series={series}
              type="line"
              width={"1000"}
              height={"400px"}
            />
         )
      }
    </section>
  );
}
