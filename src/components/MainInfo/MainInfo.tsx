import Clients from "../Clients/Clients"
import LastSales from "../LastSales/LastSales"
import Orders from "../Orders/Orders"
import style from './MainInfo.module.scss'

const MainInfo = ()=>{
   return(
      <>
         <section className={style.main_list}>
            <LastSales/>
            <Clients/>
         </section>
         <section className={style.main_list_order}>
            <Orders/>   
         </section>
      </>
     
   )
}
export default MainInfo