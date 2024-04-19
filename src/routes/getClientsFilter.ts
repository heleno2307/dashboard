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

const getClientsFilter = async (
  user: string,
  admin: boolean = false,
  filter: string,
  page: number = 1,
  limit: number = 15,
) => {
  const response = await api.get<GetClientsResponse>(
    `/api/clientsFilter/${user}`,
    {
      params: {
        admin,
        page,
        limit,
        filter,
      },
    },
  )
  return response.data
}

export default getClientsFilter
