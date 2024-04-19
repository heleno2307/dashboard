import { useEffect } from 'react'

type Ref = {
  current?: {
    value: string
  } | null
}

export const useDate = (
  dateIniRef: Ref,
  dateFimRef: Ref,
  dateIni: string,
  dateFim: string,
) => {
  useEffect(() => {
    if (dateIniRef.current && dateFimRef.current) {
      dateIniRef.current.value = dateIni
      dateFimRef.current.value = dateFim
    }
  }, [dateIni, dateFim, dateFimRef, dateIniRef])
}
