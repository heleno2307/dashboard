import getInputFilter from '@/routes/getInputFilter'
import style from './OrderInputs.module.scss'
import { useOrderContext } from '@/context/orderContext'
import { replaceDate } from '@/utilities/replaceDate'
import { useUserContext } from '@/context/userContext'
import { useAllContext } from '@/context/allContext'
import getCurrentSales from '@/routes/getCurrentSales'

import { useDate } from '@/hook/useDate'

export default function OrderInputs() {
  const {
    dateFimRef,
    dateIniRef,
    hendlerFilter,
    hendlerError,
    setSales,
    setSalesFilter,
    setPage,
    setLastPage,
    filter,
    dateFim,
    dateIni,
    filterInput,
    setDateFim,
    setDateIni,
    setFilterInput,
  } = useOrderContext()

  const { user } = useUserContext()
  const { all } = useAllContext()

  const hendlerFilterInput = async (filterInput: string) => {
    if (!user || !dateFimRef.current?.value || !dateIniRef.current?.value)
      return
    if (filterInput.trim() == '') {
      hendlerFilter(filter)
      return
    }
    const dateini: string = replaceDate(dateIniRef.current.value)
    const dateFim: string = replaceDate(dateFimRef.current.value)
    setSales(null)
    setSalesFilter(null)

    try {
      const data = await getInputFilter(
        user.code,
        dateini,
        dateFim,
        filterInput,
        all,
      )

      if (Array.isArray(data.SC5)) {
        setSales(data.SC5)
        setSalesFilter(data.SC5)
        setPage(() => (!data.next_page ? 1 : data.next_page))
        setLastPage(() => (!data.last_Page ? 0 : data.last_Page))
      }
    } catch (error) {
      // tratar error
      console.log(error)
      hendlerError(error)
    }
  }

  const hendlerDate = async () => {
    if (!user || !dateFimRef.current?.value || !dateIniRef.current?.value)
      return false

    const dateini: string = replaceDate(dateIniRef.current.value)
    const dateFim: string = replaceDate(dateFimRef.current.value)
    setSales(null)
    setSalesFilter(null)
    try {
      const data = await getCurrentSales(user.code, dateini, dateFim, all)

      if (Array.isArray(data.SC5)) {
        setSales(data.SC5)
        setSalesFilter(data.SC5)
        setPage(data.next_page)
        setLastPage(() => data.last_Page)
      }
    } catch (error) {
      // tratar error
      hendlerError(error)
    }
  }

  // ATUALIZA AS DATAS DAS REFS
  useDate(dateIniRef, dateFimRef, dateIni, dateFim)
  return (
    <div className={style.order_date}>
      <input
        type="date"
        name=""
        id=""
        className={style.input_date_order}
        value={dateIni}
        ref={dateIniRef}
        onChange={(e) => setDateIni(e.target.value)}
        onBlur={hendlerDate}
      />
      <input
        type="date"
        name=""
        id=""
        className={style.input_date_order}
        value={dateFim}
        ref={dateFimRef}
        onChange={(e) => setDateFim(e.target.value)}
        onBlur={hendlerDate}
      />
      <input
        type="text"
        placeholder="Filtro..."
        className={style.input_date_order}
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            hendlerFilterInput(filterInput)
          }
        }}
      />
    </div>
  )
}
