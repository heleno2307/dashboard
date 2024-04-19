import { api } from '@/lib/axios'

type GetClientsResponse = {
  SA1: {
    TOTAL: number
    D2_CLIENTE: string
    NOME: string
    A1_ULTCOM: string
    A1_TEL: string
    A1_EMAIL: string
    A1_LOJA: string
  }[]
  last_Page: number
  next_page: number
  page: number
  qtd_register: number
  qtd_result: number
}
const getClients = async (
  user: string,
  admin: boolean = false,
  page: number = 1,
  limit: number = 15,
) => {
  const response = await api.get<GetClientsResponse>(`/api/clients/${user}`, {
    params: {
      admin,
      page,
      limit,
    },
  })
  return response.data
}

export default getClients
