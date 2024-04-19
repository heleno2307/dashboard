import { useUserContext } from '@/context/userContext'
import style from './Clients.module.scss'
import getClients from '@/routes/getClients'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'
import Popup from '../Popup/Popup'
import Client from '../Client/Client'
import Toast from '../Toast/Toast'
import { useToast } from '@/context/toastContext'
import { useAllContext } from '@/context/allContext'
import ClientsList from './ClientsList'
import getClientsFilter from '@/routes/getClientsFilter'

type ClientType = {
  TOTAL: number
  D2_CLIENTE: string
  NOME: string
  A1_ULTCOM: string
  A1_TEL: string
  A1_EMAIL: string
  A1_LOJA: string
}
const Clients = () => {
  const { user } = useUserContext()
  const [clients, setClients] = useState<ClientType[] | null>(null)
  const [clientsAux, setClientsAux] = useState<ClientType[] | null>(null)
  const [client, setclient] = useState<ClientType | null>(null)
  const [popup, setPopup] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)
  const [input, setInput] = useState('')

  const { showToast } = useToast()
  const { all } = useAllContext()

  const targetRef = useRef<HTMLLIElement>(null)

  const hendlerError = useCallback(
    (error: unknown) => {
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000)
        setClients([])
        setClientsAux([])
      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000)
        setClients([])
        setClientsAux([])
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000)
        setClients([])
        setClientsAux([])
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000)
        setClients([])
        setClientsAux([])
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000)
        setClients([])
        setClientsAux([])
      }
    },
    [setClients, setClientsAux, showToast],
  )

  // FAZ UMA REQUISICAO PARA OBTER UMA LISTA DE CLIENTES
  const fetchData = useCallback(async () => {
    if (!user) return

    try {
      const data = await getClients(user.code, all)

      if (Array.isArray(data.SA1)) {
        // Se for um array (clientes), atualize o estado de clientes
        setClients(data.SA1)
        setClientsAux(data.SA1)
        setLastPage(() => (!data.last_Page ? 1 : data.last_Page))
        setPage(() => (!data.next_page ? 0 : data.next_page))
      }
    } catch (error) {
      // tratar erro
      console.error('Erro ao obter clientes:', error)
      hendlerError(error)
    }
  }, [user, all, hendlerError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // chamada de api para fazer paginação
  const callBackFetch = useCallback(
    async (user: string) => {
      try {
        const data = await getClients(user, all, page)
        if (Array.isArray(data.SA1)) {
          // Se for um array (clientes), atualize o estado de clientes
          setClients((current: any) => [...current, ...data.SA1])
          setClientsAux((current: any) => [...current, ...data.SA1])
          setLastPage(() => data.last_Page)
          setPage(() => data.next_page)
        }
      } catch (error) {
        console.error('Erro ao obter clientes:', error)
        hendlerError(error)
      }
    },
    [page, all, hendlerError],
  )

  // efeito que manitora se elemento é visivél e chama api se necessário
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }

      const callback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (lastPage > page && user) {
              callBackFetch(user.code)
            }
          }
        })
      }

      const observer = new IntersectionObserver(callback, options)
      const currentTarget = targetRef.current

      if (currentTarget) {
        observer.observe(currentTarget)
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget)
        }
      }
    }
  }, [user, callBackFetch, all, lastPage, page])

  // observar as auterações no estado cliente e reflete essa alteração no clientsAux
  useEffect(() => {
    setClientsAux(() => clients)
  }, [clients])

  // filtrar cliente de acordo com o valor do input
  const hendlerClientFilter = async (filter: string) => {
    if (!user) return
    setClients(null)

    if (filter.trim() != '') {
      try {
        const data = await getClientsFilter(user.code, all, filter)

        if (Array.isArray(data.SA1)) {
          setClients(data.SA1)
          setLastPage((current) => (!data.last_Page ? 0 : data.last_Page))
          setPage((current) => (!data.next_page ? 0 : data.next_page))
        }
      } catch (error) {
        // tratar error
        console.log(`Erro ao buscar clientes: ${error}`)
        hendlerError(error)
      }
    } else {
      try {
        const data = await getClients(user.code, all)

        if (Array.isArray(data.SA1)) {
          setClients(data.SA1)
          setLastPage((current) => (!data.last_Page ? 0 : data.last_Page))
          setPage((current) => (!data.next_page ? 0 : data.next_page))
        }
      } catch (error) {
        // tratar error
        console.log(`Erro ao buscar clientes: ${error}`)
        hendlerError(error)
      }
    }
  }

  const hendlerClient = (client: Client) => {
    // AO CLICAR NO CLIENT, ESSE CLIENTE E PASSADO PARA STATE
    setclient(client)
    setPopup(true)
  }

  return (
    <>
      {clients != null ? (
        <section className={style.main}>
          <div className={style.div_title}>
            <h2 className={style.title}>Clientes</h2>
          </div>
          <div className={style.inputDiv}>
            <input
              type="text"
              placeholder="Buascar Cliente"
              className={style.input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  hendlerClientFilter(input)
                }
              }}
              value={input}
            />
          </div>
          <div>
            <div className={style.header}>
              <p>Cliente</p>
              <p>Nome</p>
              <p>Total</p>
              <p>Ultima Compra</p>
            </div>
            {clients != null ? (
              <ul className={style.list}>
                <ClientsList
                  clients={clientsAux}
                  hendlerClient={hendlerClient}
                  targetRef={targetRef}
                />
              </ul>
            ) : null}
          </div>
          <Popup width={500} setState={setPopup} state={popup}>
            <Client client={client} />
          </Popup>
        </section>
      ) : (
        <section className={style.main}>
          <ImSpinner8 className={style.icon_spin} />
        </section>
      )}
      <Toast />
    </>
  )
}
export default Clients
