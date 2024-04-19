import { Dispatch, FC, RefObject, SetStateAction } from 'react'

import { useOrderContext } from '@/context/orderContext'
import { newDate } from '@/utilities/newDate'

import style from './Orders.module.scss'

interface Props {
  setPopup: Dispatch<SetStateAction<boolean>>
  salesFilter: Sales[]
  setOrder: Dispatch<SetStateAction<Order | null>>
  targetRef: RefObject<HTMLLIElement>
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
export const OrderList: FC<Props> = ({ setPopup, targetRef }) => {
  const { salesFilter, setOrder } = useOrderContext()
  return (
    <>
      {salesFilter &&
        salesFilter.map((el, i) =>
          salesFilter.length - 1 == i + 1 ? (
            <li
              id="sentinela"
              ref={targetRef}
              className={`
                           ${style.orders_list} 
                           ${el.C5_ZSTSOSS == 'ADD' ? style.new_order : null}
                           ${el.C5_ZSTSOSS == 'SPN' ? style.yellow_order : null}
                           ${el.C5_ZSTSOSS == 'SPD' ? style.confirm_order : null}
                           ${el.C5_ZSTSOSS == 'ALT' ? style.alter_order : null}
                        `}
              key={i}
              onClick={() => {
                setPopup(true)
                setOrder({
                  filial: el.C5_FILIAL,
                  order: el.C5_NUM,
                })
              }}
            >
              <div className={style.date_order}>
                <p>{newDate(el.C5_EMISSAO)}</p>
                <p>{el.C5_ZHORA}</p>
              </div>

              <p>{el.C5_FILIAL}</p>
              <p>
                {el.C5_NUM} / {el.C5_ZVERSAO}
              </p>
              <p>{el.C5_NOMECLI}</p>
              <p>{el.C6_VALOR.toFixed(2)}</p>
              <p>{el.C5_TRANSP}</p>
              {el.C5_ZSTSOSS == 'SPD' ? <p>Confirmado</p> : null}
              {el.C5_ZSTSOSS == 'SPN' ? <p>Pendente de Confirmação</p> : null}
              {el.C5_ZSTSOSS == 'ADD' ? <p>Pendente de Separação</p> : null}
              {el.C5_ZSTSOSS == 'ALT' ? <p>Alterado</p> : null}
              <p>{el.C5_NOTA ? el.C5_NOTA : null}</p>
            </li>
          ) : (
            <li
              className={`
                           ${style.orders_list} 
                           ${el.C5_ZSTSOSS == 'ADD' ? style.new_order : null}
                           ${el.C5_ZSTSOSS == 'SPN' ? style.yellow_order : null}
                           ${el.C5_ZSTSOSS == 'SPD' ? style.confirm_order : null}
                           ${el.C5_ZSTSOSS == 'ALT' ? style.alter_order : null}
                        `}
              key={i}
              onClick={() => {
                setPopup(true)
                setOrder({
                  filial: el.C5_FILIAL,
                  order: el.C5_NUM,
                })
              }}
            >
              <div className={style.date_order}>
                <p>{newDate(el.C5_EMISSAO)}</p>
                <p>{el.C5_ZHORA}</p>
              </div>

              <p>{el.C5_FILIAL}</p>
              <p>
                {el.C5_NUM} / {el.C5_ZVERSAO}
              </p>
              <p>{el.C5_NOMECLI}</p>
              <p>{el.C6_VALOR.toFixed(2)}</p>
              <p>{el.C5_TRANSP}</p>
              {el.C5_ZSTSOSS == 'SPD' ? <p>Confirmado</p> : null}
              {el.C5_ZSTSOSS == 'SPN' ? <p>Pendente de Confirmação</p> : null}
              {el.C5_ZSTSOSS == 'ADD' ? <p>Pendente de Separação</p> : null}
              {el.C5_ZSTSOSS == 'ALT' ? <p>Alterado</p> : null}
              <p>{el.C5_NOTA ? el.C5_NOTA : null}</p>
            </li>
          ),
        )}
    </>
  )
}
