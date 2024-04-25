import { api } from '@/lib/axios'

export type GetInitialResponse = {
  SD1: {
    D1_DTDIGIT: string
    D1_TOTAL: number
  }[]
  SD2: {
    D2_TOTAL: number
    D2_CUSTO1: number
    D2_EMISSAO: string
  }[]
  MES: {
    MARGEM_MES: number
    SD1_TOTAL: number
    SD2_TOTAL: number
  }
  DIA: {
    MARGEM_DIA: number
    SD1_TOTAL: number
    SD2_TOTAL: number
    SD2_LIQUIDO: number
  }
}

interface GetNameProps {
  user: string
  dateIni: string
  dateFim: string
  admin: boolean
  seller?: string
}
const getInitial = async ({
  admin = false,
  dateIni,
  seller = '',
  user,
  dateFim,
}: GetNameProps) => {
  const response = await api.get<GetInitialResponse>(`/api/initial/${user}`, {
    params: {
      dateIni,
      dateFim,
      admin,
      seller,
    },
  })
  return response.data
}

export default getInitial
