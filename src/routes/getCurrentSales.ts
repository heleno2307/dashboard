import { api } from '@/lib/axios'

interface GetCurrentSalesResponse {
  last_Page: number
  page: number
  next_page: number
  qtd_register: number
  qtd_result: number
  SC5: {
    C5_NOMECLI: string
    C5_CLIENTE: string
    C5_CONDPAG: string
    E4_DESCRI: string
    C5_NOTA: string
    C5_EMISSAO: string
    C5_ZSTSOSS: string
    C5_FILIAL: string
    C5_ZSEPARA: string
    C5_ZHORA: string
    C6_VALOR: number
    USR_CODIGO: string
    C5_NUM: string
    C5_ZVERSAO: string
    C5_TRANSP: string
  }[]
}
const getCurrentSales = async (
  user: string,
  dateIni: string,
  dateFim: string,
  admin: boolean = false,
  page: number = 1,
  limit: number = 15,
) => {
  const response = await api.get<GetCurrentSalesResponse>(
    `/api/currentSales/${user}`,
    {
      params: {
        dateIni,
        dateFim,
        admin,
        page,
        limit,
      },
    },
  )
  return response.data
}

export default getCurrentSales
