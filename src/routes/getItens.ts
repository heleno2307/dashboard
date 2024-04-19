import { api } from '@/lib/axios'

type GetOrderItemResponse = {
  C6_ITEM: string
  C6_PRODUTO: string
  C6_PRCVEN: number
  C6_VALOR: number
  C6_TES: string
  C6_QTDVEN: number
  B1_DESC: string
}[]
const getItens = async (user: string, filial: string, order: string) => {
  const response = await api.get<GetOrderItemResponse>(
    `/api/orderItem/${user}`,
    {
      params: {
        filial,
        order,
      },
    },
  )
  return response.data
}

export default getItens
