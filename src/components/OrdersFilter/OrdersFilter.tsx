import style from './OrdersFilter.module.scss'
import { useOrderContext } from '@/context/orderContext'

export default function OrdersFilter() {
  const { filter, setFilter, hendlerFilter } = useOrderContext()

  return (
    <div className={style.main_status}>
      <div className={style.order_status}>
        <label htmlFor="ADD" className={style.label_order}>
          Pendente de Separação
        </label>
        <input
          type="radio"
          name="status"
          id="ADD"
          className={style.input_radio}
          onChange={() => {
            setFilter('ADD')
            hendlerFilter('ADD')
          }}
          value="ADD"
          checked={filter == 'ADD'}
        />
      </div>
      <div className={style.order_status}>
        <label htmlFor="SPD" className={style.label_order}>
          Confirmados
        </label>
        <input
          type="radio"
          name="status"
          id="SPD"
          className={style.input_radio}
          onChange={() => {
            setFilter('SPD')
            hendlerFilter('SPD')
          }}
          value="SPD"
          checked={filter == 'SPD'}
        />
      </div>
      <div className={style.order_status}>
        <label htmlFor="SPN" className={style.label_order}>
          Pedente de Confirmação
        </label>
        <input
          type="radio"
          name="status"
          id="SPN"
          checked={filter == 'SPN'}
          className={style.input_radio}
          onChange={() => {
            setFilter('SPN')
            hendlerFilter('SPN')
          }}
          value="SPN"
        />
      </div>
      <div className={style.order_status}>
        <label htmlFor="TD" className={style.label_order}>
          Todos
        </label>
        <input
          type="radio"
          name="status"
          id="TD"
          className={style.input_radio}
          onChange={() => {
            setFilter('TD')
            hendlerFilter('TD')
          }}
          checked={filter == 'TD'}
          value="TD"
        />
      </div>
      <div className={style.order_status}>
        <label htmlFor="NF" className={style.label_order}>
          Nfe
        </label>
        <input
          type="radio"
          name="status"
          id="NF"
          className={style.input_radio}
          onChange={() => {
            setFilter('NF')
            hendlerFilter('NF')
          }}
          value="NF"
          checked={filter == 'NF'}
        />
      </div>
    </div>
  )
}
