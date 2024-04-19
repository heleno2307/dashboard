export function newDate(dateString: string | undefined) {
  if (!dateString) return
  const date = new Date(dateString)
  const dia = date.getUTCDate().toString()
  const diaF = dia.length == 1 ? '0' + dia : dia
  const mes = (date.getUTCMonth() + 1).toString() // +1 pois no getUTCMonth Janeiro começa com zero.
  const mesF = mes.length == 1 ? '0' + mes : mes
  const anoF = date.getUTCFullYear()
  return `${diaF}/${mesF}/${anoF}`
}
