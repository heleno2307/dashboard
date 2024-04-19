import { useCallback, useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'

import { useOrderContext } from '@/context/orderContext'
import { useToast } from '@/context/toastContext'
import { useUserContext } from '@/context/userContext'
import getItens from '@/routes/getItens'
import limitarCaracteres from '@/utilities/limitarCaracteres'

import style from './Itens.module.scss'

type SC6 = {
  C6_ITEM: string
  C6_PRODUTO: string
  C6_PRCVEN: number
  C6_VALOR: number
  C6_TES: string
  C6_QTDVEN: number
  B1_DESC: string
}
const Itens = () => {
  const { user } = useUserContext()
  const [itens, setItens] = useState<SC6[] | null>(null)
  const { showToast } = useToast()
  const { order } = useOrderContext()

  const fetchData = useCallback(async () => {
    if (!user || !order?.filial || !order?.order) return

    try {
      const data = await getItens(user.code, order.filial, order.order)
      if (Array.isArray(data)) {
        setItens(data)
      }
    } catch (error) {
      // tratar error
      if (error === 404) {
        showToast('erro', 'Error 02, contactar administrador', 4000)
        setItens([])
      } else if (error === 500) {
        showToast('erro', 'Error 03, contactar administrador', 4000)
        setItens([])
      } else if (error === 401) {
        showToast('erro', 'Error 04, contactar administrador', 4000)
        setItens([])
      } else if (error === 402) {
        showToast('erro', 'Error 01, contactar administrador', 4000)
        setItens([])
      } else {
        showToast('erro', 'Error 05, contactar administrador', 4000)
        setItens([])
      }
    }
  }, [user, order?.filial, order?.order, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!itens) {
    return (
      <section className={style.load}>
        <ImSpinner8 className={style.icon_spin} />
      </section>
    )
  }

  return (
    <section className={style.container}>
      <div className={style.title}>
        <h2>Itens do Pedido</h2>
      </div>
      <div className={style.header}>
        <p className={style.titles}>Item</p>
        <p className={style.titles}>Codigo</p>
        <p className={style.titles}>Descrição</p>
        <p className={style.titles}>Quantidade</p>
        <p className={style.titles}>Valor Unitário</p>
        <p className={style.titles}>Valor Total</p>
        <p className={style.titles}>Tipo de Saída</p>
      </div>
      <ul className={style.list}>
        {itens?.map((el, i) => (
          <li className={style.item} key={i}>
            <p className={style.itens}>{el.C6_ITEM}</p>
            <p className={style.itens}>{el.C6_PRODUTO.trim()}</p>
            <p className={style.itens}>
              {limitarCaracteres(el.B1_DESC.trim(), 25)}
            </p>
            <p className={style.itens}>{el.C6_QTDVEN}</p>
            <p className={style.itens}>{el.C6_PRCVEN.toFixed(2)}</p>
            <p className={style.itens}>{el.C6_VALOR.toFixed(2)}</p>
            <p className={style.itens}>{el.C6_TES}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
export default Itens
