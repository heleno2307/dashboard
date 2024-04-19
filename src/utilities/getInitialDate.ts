export const getInitialDate = () => {
  const today = new Date()
  let lastDayOfPreviousMonth

  if (today.getDate() <= 26) {
    lastDayOfPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      26,
    )
  } else {
    lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 26)
  }
  return result(lastDayOfPreviousMonth)
}

export const getInitialDateOrder = () => {
  const today = new Date()
  const lastDayOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 5,
  )
  return result(lastDayOfPreviousMonth)
}

const result = (lastDayOfPreviousMonth: Date) => {
  const year = lastDayOfPreviousMonth.getFullYear()
  const month = (lastDayOfPreviousMonth.getMonth() + 1)
    .toString()
    .padStart(2, '0')
  const day = lastDayOfPreviousMonth.getDate().toString().padStart(2, '0')
  const initialDate = `${year}-${month}-${day}`
  return initialDate
}
