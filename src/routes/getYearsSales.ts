import { api } from '@/lib/axios'

interface GetSalesYearsResponse {
  SD1: {
    mes: string
    ano: string
    total: number
  }[]
  SD2: {
    mes: string
    ano: string
    total: number
  }[]
  lengthDate: number
  months: string[]
}
const getSalesYears = async (
  user: string,
  seller: string,
  dateIni: string,
  dateFim: string,
) => {
  const response = await api.get<GetSalesYearsResponse>(
    `/api/salesYears/${user}`,
    {
      params: {
        seller,
        dateIni,
        dateFim,
      },
    },
  )
  return response.data
}

export default getSalesYears
