import { api } from '@/lib/axios'

interface GetAdminResponse {
  access: boolean
}
const getAdmin = async (user: string) => {
  const response = await api.get<GetAdminResponse>(`/api/admin/${user}`)
  return response.data
}

export default getAdmin
