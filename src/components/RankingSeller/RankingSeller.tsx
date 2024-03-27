import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
   ssr: false,
 });
 
function RankingSeller() {
   const options: ApexOptions = {
      chart: {
        id: "seller"
      },
      dataLabels:{
        enabled:false
      },
      xaxis: {
        categories: ['ana','julia'],
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
      colors: ["#5fee34"],
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
        data: [1,2,3],
      },
    ];
   return ( 
      <section>
         <h2>Gráfico de vendedores</h2>
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