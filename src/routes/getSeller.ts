import { api } from '@/lib/axios'

interface GetSellerResponse {
  A3_COD: string
}
const getSeller = async (user: string) => {
  const response = await api.get<GetSellerResponse>(`/api/seller/${user}`)
  return response.data
}

export default getSeller
