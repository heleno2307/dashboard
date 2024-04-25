import { useQuery } from '@tanstack/react-query'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { toast } from 'sonner'

import { useSellerContext } from '@/context/sellerContext'
import { useUserContext } from '@/context/userContext'
import getCountOrder from '@/routes/getCountOrder'

import styles from './OrderChart.module.scss'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function OrderChart() {
  const [order, setOrder] = useState<[number, number]>([0, 0])
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const { user } = useUserContext()
  const { seller } = useSellerContext()

  const { data, isError } = useQuery({
    queryKey: ['canceled-orders', user?.code, month, year, seller?.A3_COD],
    queryFn: () => {
      if (!user || !seller) {
        return Promise.resolve({ total_order: 0, total_deleted: 0 })
      }

      const formatedMonth = month <= 9 ? `0${month}` : month

      return getCountOrder(
        user.code,
        seller.A3_COD,
        `${year}${formatedMonth}01`,
        `${year}${formatedMonth}31`,
      )
    },
    enabled: !!user && !!seller,
  })

  useEffect(() => {
    if (data) {
      setOrder([data.total_order, data.total_deleted])
      console.log(data)
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.error('Ops! Algo deu errado ao carregar o gráfico de pedidos.')
    }
  }, [isError])

  const hendlerPlusDate = () => {
    if (month === 12) {
      setMonth(1)
      setYear((current) => current + 1)
    } else {
      setMonth((current) => current + 1)
    }
  }

  const hendlerMinusDate = () => {
    if (month === 1) {
      setMonth(12)
      setYear((current) => current - 1)
    } else {
      setMonth((current) => current - 1)
    }
  }

  const options: ApexOptions = {
    chart: {
      id: 'donut-chart',
    },
    colors: ['#0191CE', '#F37020'],
    labels: ['Pedidos N/Excluídos', 'Pedidos Excluídos'],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(2) + '%'
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
  }
  return (
    <div className={styles.content}>
      <h3>Percentual de pedidos Excluídos</h3>
      <div className={styles.years}>
        <IoIosArrowBack className={styles.icon} onClick={hendlerMinusDate} />
        {`${month} - ${year}`}
        <IoIosArrowForward className={styles.icon} onClick={hendlerPlusDate} />
      </div>
      <div className={styles.chart}>
        {typeof window !== 'undefined' && (
          <Chart options={options} series={order} type="donut" width={450} />
        )}
      </div>
    </div>
  )
}
