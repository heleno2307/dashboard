import { OrderContextProvider } from '@/context/orderContext'
import Clients from '../Clients/Clients'
import LastSales from '../LastSales/LastSales'
import Orders from '../Orders/Orders'
import style from './MainInfo.module.scss'

const MainInfo = () => {
  return (
    <>
      <section className={style.main_list}>
        <LastSales />
        <Clients />
      </section>
      <section className={style.main_list_order}>
        <OrderContextProvider>
          <Orders />
        </OrderContextProvider>
      </section>
    </>
  )
}
export default MainInfo
