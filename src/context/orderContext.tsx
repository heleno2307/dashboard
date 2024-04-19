import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { useToast } from './toastContext'
import getCurrentSalesFilter from '@/routes/getCurrentSalesFilter'
import getCurrentSales from '@/routes/getCurrentSales'
import { replaceDate } from '@/utilities/replaceDate'
import { useAllContext } from './allContext'
import { useUserContext } from './userContext'
import { getInitialDateOrder } from '@/utilities/getInitialDate'
import { getDate } from '@/utilities/getDate'

interface OrderProviderProps {
  children: ReactNode
}

type Order = {
  filial: string | null
  order: string | null
}
type Sales = {
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
}

type Context = {
  sales: Sales[] | null
  order: Order | null
  setOrder: Dispatch<SetStateAction<Order | null>>
  setSales: Dispatch<SetStateAction<Sales[] | null>>
  hendlerError: (error: unknown) => void
  salesFilter: Sales[] | null
  setSalesFilter: Dispatch<SetStateAction<Sales[] | null>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  lastPage: number
  setLastPage: Dispatch<SetStateAction<number>>
  dateIniRef: React.RefObject<HTMLInputElement>
  dateFimRef: React.RefObject<HTMLInputElement>
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
  hendlerFilter: (filter: string) => void
  dateIni: string
  setDateIni: Dispatch<SetStateAction<string>>
  dateFim: string
  setDateFim: Dispatch<SetStateAction<string>>
  filterInput: string
  setFilterInput: Dispatch<SetStateAction<string>>
}

const orderContext = createContext<Context | null>(null)

const OrderContextProvider = ({ children }: OrderProviderProps) => {
  const [sales, setSales] = useState<Sales[] | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [salesFilter, setSalesFilter] = useState<Sales[] | null>(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)
  const [filter, setFilter] = useState('TD')
  const [dateIni, setDateIni] = useState<string>(getInitialDateOrder())
  const [dateFim, setDateFim] = useState<string>(getDate())
  const [filterInput, setFilterInput] = useState<string>('')

  // utlização de contextos
  const { showToast } = useToast()
  const { user } = useUserContext()
  const { all } = useAllContext()

  // Refs do componentes
  const dateIniRef = useRef<HTMLInputElement>(null)
  const dateFimRef = useRef<HTMLInputElement>(null)

  // faz um tratamento basico de erro na aplicação
  const hendlerError = useCallback(
    (error: unknown) => {
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000)
        setSales([])
        setSalesFilter([])
      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000)
        setSales([])
        setSalesFilter([])
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000)
        setSales([])
        setSalesFilter([])
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000)
        setSales([])
        setSalesFilter([])
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000)
        setSales([])
        setSalesFilter([])
      }
    },
    [setSales, setSalesFilter, showToast],
  )

  // busca no banco de dados de acordo com os filtros passados via parâmetro.
  const hendlerFilter = async (filter: string) => {
    if (!user || !dateFimRef.current?.value || !dateIniRef.current?.value)
      return

    const dateini: string = replaceDate(dateIniRef.current.value)
    const dateFim: string = replaceDate(dateFimRef.current.value)

    setSalesFilter(null)

    // checa se o filtro todos está ativo e chama api de pedidos.
    if (filter == 'TD') {
      try {
        const data = await getCurrentSales(user.code, dateini, dateFim, all)
        console.log(data)
        // verifica se é um arry e altera os estados.
        if (Array.isArray(data.SC5)) {
          setSales(data.SC5)
          setSalesFilter(data.SC5)
          setPage(() => (!data.next_page ? 1 : data.next_page))
          setLastPage(() => (!data.last_Page ? 0 : data.last_Page))
        }
      } catch (error) {
        // tratar erro
        hendlerError(error)
      }
    } else {
      try {
        // chama api passando como parâmetros os filtros
        const data = await getCurrentSalesFilter(
          user.code,
          dateini,
          dateFim,
          filter,
          all,
        )
        // verifica se é um arry e altera os estados.
        if (Array.isArray(data.SC5)) {
          setSales(data.SC5)
          setSalesFilter(data.SC5)
          setPage(() => (!data.next_page ? 1 : data.next_page))
          setLastPage(() => (!data.last_Page ? 0 : data.last_Page))
        }
      } catch (error) {
        // tratar error
        hendlerError(error)
      }
    }
  }

  return (
    <orderContext.Provider
      value={{
        order,
        setOrder,
        sales,
        setSales,
        hendlerError,
        salesFilter,
        setSalesFilter,
        page,
        setPage,
        lastPage,
        setLastPage,
        dateFimRef,
        dateIniRef,
        filter,
        setFilter,
        hendlerFilter,
        dateFim,
        dateIni,
        filterInput,
        setDateFim,
        setDateIni,
        setFilterInput,
      }}
    >
      {children}
    </orderContext.Provider>
  )
}

const useOrderContext = () => {
  const context = useContext(orderContext)
  if (!context) {
    throw new Error(
      'useOrderContext  must be used within a OrderContextProvider',
    )
  }
  return context
}

export { OrderContextProvider, useOrderContext }
