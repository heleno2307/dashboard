import { api } from '@/lib/axios'

interface GetSellerMonthSalesResponse {
  SD1: {
    nome: string
    ano: string
    mes: string
    total: number
  }[]
  SD2: {
    nome: string
    ano: string
    mes: string
    total: number
  }[]
}
const getSellerMonthSales = async (
  user: string,
  dateIni: string,
  dateFim: string,
) => {
  const response = await api.get<GetSellerMonthSalesResponse>(
    `/api/sellerSalesMonths/${user}`,
    {
      params: {
        dateIni,
        dateFim,
      },
    },
  )
  return response.data
}

export default getSellerMonthSales
