import { api } from '@/lib/axios'

type GetDevolutionResponse = {
  D1_FILIAL: string
  D1_DOC: string
  D1_TOTAL: number
  D2_DOC: string
  D2_EMISSAO: string
  A1_NOME: string
  C5_VEND1: string
  A3_NOME: string
}[]
const getDevolution = async (
  user: string,
  date: string,
  admin: boolean,
  seller: string = '',
) => {
  const response = await api.get<GetDevolutionResponse>(
    `/api/devolution/${user}`,
    {
      params: { date, admin, seller },
    },
  )
  return response.data
}

export default getDevolution
