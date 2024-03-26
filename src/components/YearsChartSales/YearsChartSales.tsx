import { useCallback, useEffect, useState } from "react";
import styles from "./YearsChartSales.module.scss";
import getSalesYears from "@/routes/getYearsSales";
import { useUserContext } from "@/context/userContext";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"),{
   ssr: false
});

interface DataFetch{
   SD1: SD1[]
   SD2: SD2[]
   lenght: number
   months:string[]
}
interface SD1{
   mes:string,
   ano:string,
   total:number
}
interface SD2{
   mes:string,
   ano:string,
   total:number
}

export default function YearsChatSales() {
  const [sd2, setSd2] = useState<number[]>([]);
  const [sd1, setSd1] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const { user } = useUserContext();

  const fetchData = useCallback(async () => {
    if (!user || typeof window === "undefined") return;

    const dataMes:DataFetch = await getSalesYears(user.code,"000050","20230101","20240326");
    const sd2Data: number[] = new Array(dataMes.lenght).fill(0); 
    const sd1Data: number[] = new Array(dataMes.lenght).fill(0); 

    dataMes.SD2.forEach((item:SD2,i) => {
      sd2Data[i] =  parseInt(item.total.toString());
    });

    dataMes.SD1.forEach((item:SD1,i) => {
      sd1Data[i] =  parseInt(item.total.toString());
      
    });
    setMeses(dataMes.months)
    setSd2(sd2Data);
    setSd1(sd1Data);
    
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: meses,
    },
    yaxis: {
      labels: {
        formatter: function (val:number) {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(val);
        },
      },
    },
    colors:['#34ee43', '#db4444',]
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
      <h2>Vendas Anuais</h2>
      {typeof window !== "undefined" && (
        <Chart
          options={options}
          series={series}
          type="bar"
          width={"1100px"}
          height={"400px"}
        />
      )}
    </section>
  );
}
