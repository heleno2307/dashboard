import { api } from '@/lib/axios'

export type GetNameResponse = [
  {
    USR_CODIGO: string
  },
]
const getName = async (user: string) => {
  const response = await api.get<GetNameResponse>(`/api/name/${user}`)
  return response.data
}

export default getName
