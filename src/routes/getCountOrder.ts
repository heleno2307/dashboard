import { api } from '@/lib/axios'

interface GetCountOrderResponse {
  total_deleted: number
  total_order: number
}
const getCountOrder = async (
  user: string,
  seller: string,
  dateIni: string,
  dateFim: string,
) => {
  const response = await api.get<GetCountOrderResponse>(
    `/api/countOrder/${user}`,
    {
      params: {
        seller,
        dateFim,
        dateIni,
      },
    },
  )
  return response.data
}

export default getCountOrder
