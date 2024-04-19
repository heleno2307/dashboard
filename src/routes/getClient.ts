import { api } from '@/lib/axios'

interface GetClientResponse {
  VARIACAO: number
}
const getClient = async (
  user: string,
  loja: string,
  client: string,
  admin: boolean,
) => {
  const response = await api.get<GetClientResponse>(
    `/api/client/${loja}/${user}/${client}`,
    {
      params: {
        admin,
      },
    },
  )
  return response.data
}

export default getClient
