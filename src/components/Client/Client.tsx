import { useCallback, useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'

import { useAllContext } from '@/context/allContext'
import { useToast } from '@/context/toastContext'
import { useUserContext } from '@/context/userContext'
import getClient from '@/routes/getClient'
import { newDate } from '@/utilities/newDate'

import style from './Client.module.scss'

type Client = {
  TOTAL: number
  D2_CLIENTE: string
  NOME: string
  A1_ULTCOM: string
  A1_TEL: string
  A1_EMAIL: string
  A1_LOJA: string
}

type Variacao = {
  VARIACAO: number
}
type Props = {
  client: Client
}

const Client = ({ client }: Props) => {
  const [varicao, setVariacao] = useState<number | null>(null)
  const [color, setColor] = useState<'neutro' | 'positive' | 'negative'>(
    'neutro',
  )
  const { user } = useUserContext()
  const { showToast } = useToast()
  const { all } = useAllContext()

  const fetchData = useCallback(async () => {
    if (!user || !client?.A1_LOJA || !client.D2_CLIENTE || !client) return
    try {
      const data = await getClient(
        user.code,
        client.A1_LOJA,
        client.D2_CLIENTE,
        all,
      )

      if (data.VARIACAO) {
        setVariacao(data.VARIACAO)
        alterColor(data)
      }
    } catch (error) {
      // tratar error
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000)
        setVariacao(0)
      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000)
        setVariacao(0)
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000)
        setVariacao(0)
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000)
        setVariacao(0)
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000)
        setVariacao(0)
      }
    }
  }, [user, all, client, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const alterColor = (data: Variacao) => {
    if (data.VARIACAO > 0) {
      setColor('positive')
    } else if (data.VARIACAO === 0) {
      setColor('neutro')
    } else {
      setColor('negative')
    }
  }

  return (
    <section className={style.main}>
      <div className={style.div_title}>
        <h2 className={style.title}>
          {client?.D2_CLIENTE} / {client?.A1_LOJA}
        </h2>
      </div>
      <div className={style.div_value}>
        <p className={style.title_value}>Nome:</p>
        <p className={style.value}>{client?.NOME.trim()}</p>
      </div>

      <div className={style.div_value}>
        <p className={style.title_value}>Total:</p>
        <p className={style.value}>
          {client?.TOTAL.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>
      <div className={style.div_value}>
        <p className={style.title_value}>Ultima Compra:</p>
        <p className={style.value}>{newDate(client?.A1_ULTCOM)}</p>
      </div>
      {client?.A1_TEL.trim() != null ? (
        <div className={style.div_value}>
          <p className={style.title_value}>Telefone:</p>
          <p className={style.value}>{client?.A1_TEL.trim()}</p>
        </div>
      ) : null}
      {client?.A1_EMAIL.trim() != null ? (
        <div className={style.div_value}>
          <p className={style.title_value}>Email:</p>
          <p className={style.value}>
            {client?.A1_EMAIL.replace(';', ' ').trim()}
          </p>
        </div>
      ) : null}

      <div className={style.variacao_div}>
        <p className={style.title_variacao}>Variação</p>
        <p
          className={`${style.value_variacao} 
                  ${color === 'positive' ? style.positive : null}
                  ${color === 'negative' ? style.negative : null}
                  ${color === 'neutro' ? style.neutro : null}`}
        >
          {varicao != null ? (
            `${varicao.toFixed(2)}%`
          ) : (
            <ImSpinner8 className={style.icon_spin} />
          )}
        </p>
      </div>
    </section>
  )
}
export default Client
