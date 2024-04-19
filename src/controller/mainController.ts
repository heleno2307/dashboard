import {
  addMonths,
  differenceInDays,
  differenceInMonths,
  format,
  parseISO,
} from 'date-fns'

import Model from '@/model/mainModel'
import { subtrairDias } from '@/utilities/subtrairDias'

const model = new Model()

type UserData = {
  A3_COD: string
  USR_CODIGO: string
  USR_ID: string
}

type SD2 = {
  D2_TOTAL: number
  D2_CUSTO1: number
  D2_EMISSAO: string
}

type Sales = {
  C5_NOMECLI: string
  C5_CLIENTE: string
  C5_CONDPAG: string
  E4_DESCRI: string
  C5_NOTA: string

  C5_EMISSAO: string
  C5_ZSTOSS: string
  C5_FILIAL: string
  C5_ZSEPARA: string
  C5_ZHORA: string
  C6_VALOR: number
  USR_CODIGO: string
  C5_NUM: string
  C5_ZVERSAO: string
}
type CurrentDevolution = {
  D1_FILIAL: string
  D1_DOC: string
  D1_TOTAL: number
  D2_DOC: string
  D2_EMISSAO: string
  A1_NOME: string
  C5_VEND1: string
  A3_NOME: string
}
type Moviment = {
  F2_EMISSAO: string
  F2_VALMERC: number
}

type SD1 = {
  D1_FILIAL: string
  D1_DOC: string
  F2_DOC: string
  D1_DTDIGIT: string
  F2_VALMERC: number
  F2_EMISSAO: string
  A1_NOME: string
  F2_VEND1: string
  D1_TOTAL: number
}
interface Item {
  D1_TOTAL?: number
  D2_TOTAL?: number
  D1_DTDIGIT?: Date
  D2_EMISSAO?: Date
}

type SC6 = {
  C6_ITEM: string
  C6_PRODUTO: string
  C6_PRCVEN: number
  C6_VALOR: number
  C6_TES: string
  C6_QTDVEN: number
}

export default class Controller {
  private loginUser: string

  constructor(loginUser: string) {
    this.loginUser = loginUser.toLocaleUpperCase()
  }

  // RETORNA O USUARIO
  async getUser() {
    if (!this.loginUser.trim()) return 401

    try {
      const data = await model.getName(this.loginUser)
      return data
    } catch (error) {
      return 402
    }
  }

  // RETORNA UMA LISTA DE PEDIDOS
  async getSales(
    dateIni: string,
    dateFim: string,
    admin: boolean = false,
    page: number = 1,
    limitUser: number = 15,
  ) {
    if (
      !dateIni.trim() ||
      !dateFim.trim() ||
      admin == null ||
      admin === undefined
    )
      return 401

    if (admin) {
      try {
        const registerData = await model.getCountSales(
          '',
          '999999',
          dateIni,
          dateFim,
        )
        const register = registerData[0].CONT

        if (register !== 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const data: Sales[] = await model.getSales(
            '',
            '999999',
            dateIni,
            dateFim,
            limit,
            page,
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: data.length,
            SC5: data,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SC5: [],
          }
        }
      } catch (error) {
        return 402
      }
    } else {
      try {
        const userCod = await this.getSellerCod()
        const registerData = await model.getCountSales(
          userCod,
          userCod,
          dateIni,
          dateFim,
        )
        const register = registerData[0].CONT
        if (register !== 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const data: Sales[] = await model.getSales(
            userCod,
            userCod,
            dateIni,
            dateFim,
            limit,
            page,
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: data.length,
            SC5: data,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SC5: [],
          }
        }
      } catch (error) {
        return 402
      }
    }
  }

  async getSalesFilter(
    dateIni: string,
    dateFim: string,
    admin: boolean = false,
    filter: string,
    page: number = 1,
    limitUser: number = 15,
  ) {
    if (!filter.trim() || admin == null || admin === undefined) return 401

    if (admin) {
      if (filter.trim().toUpperCase() === 'NF') {
        try {
          const registerData = await model.getCountSalesNf(
            '',
            '999999',
            dateIni,
            dateFim,
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesNf(
              '',
              '999999',
              dateIni,
              dateFim,
              limit,
              page,
            )
            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      } else if (
        filter.trim().toUpperCase() === 'ADD' ||
        filter.trim().toUpperCase() === 'ALT'
      ) {
        try {
          const registerData = await model.getCountSalesAdd(
            '',
            '999999',
            dateIni,
            dateFim,
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesAdd(
              '',
              '999999',
              dateIni,
              dateFim,
              limit,
              page,
            )
            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      } else {
        try {
          const registerData = await model.getCountSalesFilter(
            '',
            '999999',
            dateIni,
            dateFim,
            filter.trim().toUpperCase(),
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesFilter(
              '',
              '999999',
              dateIni,
              dateFim,
              limit,
              page,
              filter.trim().toUpperCase(),
            )
            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      }
    } else {
      if (filter.trim().toUpperCase() === 'NF') {
        try {
          const userCod = await this.getSellerCod()
          const registerData = await model.getCountSalesNf(
            userCod,
            userCod,
            dateIni,
            dateFim,
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesNf(
              userCod,
              userCod,
              dateIni,
              dateFim,
              limit,
              page,
            )

            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      } else if (
        filter.trim().toUpperCase() === 'ADD' ||
        filter.trim().toUpperCase() === 'ALT'
      ) {
        try {
          const userCod = await this.getSellerCod()
          const registerData = await model.getCountSalesAdd(
            userCod,
            userCod,
            dateIni,
            dateFim,
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesAdd(
              userCod,
              userCod,
              dateIni,
              dateFim,
              limit,
              page,
            )

            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      } else {
        try {
          const userCod = await this.getSellerCod()
          const registerData = await model.getCountSalesFilter(
            userCod,
            userCod,
            dateIni,
            dateFim,
            filter.trim().toUpperCase(),
          )
          const register = registerData[0].CONT

          if (register !== 0) {
            const limit = limitUser > 15 ? 15 : limitUser
            const lastPage = Math.ceil(register / limit)
            const data: Sales[] = await model.getSalesFilter(
              userCod,
              userCod,
              dateIni,
              dateFim,
              limit,
              page,
              filter.trim().toUpperCase(),
            )

            return {
              last_Page: lastPage,
              page,
              next_page: page < lastPage ? page + 1 : false,
              qtd_register: register,
              qtd_result: data.length,
              SC5: data,
            }
          } else {
            return {
              last_Page: false,
              page,
              next_page: false,
              qtd_register: register,
              qtd_result: 0,
              SC5: [],
            }
          }
        } catch (error) {
          return 402
        }
      }
    }
  }

  async getSalesFilterInput(
    dateIni: string,
    dateFim: string,
    admin: boolean = false,
    filter: string,
    page: number = 1,
    limitUser: number = 15,
  ) {
    if (
      !dateIni ||
      !dateFim ||
      admin == null ||
      admin === undefined ||
      !filter.trim()
    )
      return 401

    if (admin) {
      try {
        const registerData = await model.getCountSalesInput(
          '',
          '999999',
          dateIni,
          dateFim,
          filter.trim().toUpperCase(),
        )
        const register = registerData[0].CONT

        if (register !== 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const data: Sales[] = await model.getSalesInput(
            '',
            '999999',
            dateIni,
            dateFim,
            limit,
            page,
            filter.trim().toUpperCase(),
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: data.length,
            SC5: data,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SC5: [],
          }
        }
      } catch (error) {
        return 402
      }
    } else {
      try {
        const userCod = await this.getSellerCod()
        const registerData = await model.getCountSalesInput(
          userCod,
          userCod,
          dateIni,
          dateFim,
          filter.trim().toUpperCase(),
        )
        const register = registerData[0].CONT
        if (register !== 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const data: Sales[] = await model.getSalesInput(
            userCod,
            userCod,
            dateIni,
            dateFim,
            limit,
            page,
            filter.trim().toUpperCase(),
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: data.length,
            SC5: data,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SC5: [],
          }
        }
      } catch (error) {
        return 402
      }
    }
  }

  // RETORNA DEVOLUÇÃO DETALHADA
  async getCurrentDevolution(
    date: string,
    admin: boolean,
    seller: string = '',
  ) {
    if (!date || admin == null || admin === undefined) return 401

    try {
      if (admin) {
        const data: CurrentDevolution[] = await model.getDevolutionDatails(
          '',
          '999999',
          date,
        )
        return data
      } else {
        const userCod = seller !== '' ? seller : await this.getSellerCod()
        const data: CurrentDevolution[] = await model.getDevolutionDatails(
          userCod,
          userCod,
          date,
        )
        return data
      }
    } catch (error) {
      return 402
    }
  }

  // RETORNA O CODIGO DE VENDEDOR
  async getSellerCod() {
    const user: UserData[] = await model.getName(this.loginUser)
    return user[0].A3_COD
  }

  // RETORNA UMA LISTA DE CLIENTES E SEUS TOTAIS DE COMPRA
  async getClients(
    admin: boolean = false,
    page: number = 1,
    limitUser: number = 15,
  ) {
    if (admin == null || admin === undefined) return 401
    const date180 = subtrairDias(180)

    if (admin) {
      try {
        const registerData = await model.getCountClients('', date180, '999999')
        const register = registerData[0].CONT

        if (register > 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const clients = await model.getClients(
            '',
            date180,
            '999999',
            limit,
            page,
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: clients.length,
            SA1: clients,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SA1: [],
          }
        }
      } catch (error) {
        return 402
      }
    } else {
      try {
        const userCod = await this.getSellerCod()
        const registerData = await model.getCountClients(
          userCod,
          date180,
          userCod,
        )
        const register = registerData[0].CONT

        if (register > 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const clients = await model.getClients(
            userCod,
            date180,
            userCod,
            limit,
            page,
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: clients.length,
            SA1: clients,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SA1: [],
          }
        }
      } catch (error) {
        return 402
      }
    }
  }

  // RETORNA UMA LISTA DE CLIENTES E SEUS TOTAIS DE COMPRA
  async getClientsFilter(
    admin: boolean,
    page: number = 1,
    limitUser: number = 15,
    filter: string,
  ) {
    if (admin == null || admin === undefined) return 401
    const date180 = subtrairDias(180)

    if (admin) {
      try {
        const registerData = await model.getCountClientsFilter(
          '',
          date180,
          '999999',
          filter.trim().toUpperCase(),
        )
        const register = registerData[0].CONT

        if (register > 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const clients = await model.getClientsFilter(
            '',
            date180,
            '999999',
            limit,
            page,
            filter.trim().toUpperCase(),
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: clients.length,
            SA1: clients,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SA1: [],
          }
        }
      } catch (error) {
        return 402
      }
    } else {
      try {
        const userCod = await this.getSellerCod()
        const registerData = await model.getCountClientsFilter(
          userCod,
          date180,
          userCod,
          filter.trim().toUpperCase(),
        )
        const register = registerData[0].CONT

        if (register > 0) {
          const limit = limitUser > 15 ? 15 : limitUser
          const lastPage = Math.ceil(register / limit)
          const clients = await model.getClientsFilter(
            userCod,
            date180,
            userCod,
            limit,
            page,
            filter.trim().toUpperCase(),
          )
          return {
            last_Page: lastPage,
            page,
            next_page: page < lastPage ? page + 1 : false,
            qtd_register: register,
            qtd_result: clients.length,
            SA1: clients,
          }
        } else {
          return {
            last_Page: false,
            page,
            next_page: false,
            qtd_register: register,
            qtd_result: 0,
            SA1: [],
          }
        }
      } catch (error) {
        return 402
      }
    }
  }

  // RETORNA CALCULO DE VARIAÇÃO DE COMPRA DE UM CLIENTE
  async getClient(codClient: string, loja: string, admin: boolean) {
    if (admin == null || admin === undefined || !codClient || !loja) return 401

    try {
      const userCod = await this.getSellerCod()
      const days = subtrairDias(179)
      let movimentos: Moviment[]
      if (admin) {
        movimentos = await model.getClient('', '999999', days, loja, codClient)
      } else {
        movimentos = await model.getClient(
          userCod,
          userCod,
          days,
          loja,
          codClient,
        )
      }

      // função para calculo de média
      const sumMedia = (arr: Moviment[]) => {
        let count = 0
        arr.forEach((el) => {
          count += el.F2_VALMERC
        })

        return count / 6
      }

      // função que soma as movimentações em um determindado intervalo de tempo.
      const sumMoviment = (
        arr: Moviment[],
        daysIni: number,
        daysFim: number,
      ) => {
        // retorna um arry com data de emissão no intervalo de tempo passo via paranmetro
        const filterMonth = (
          daysFilterIni: number,
          daysFilterFim: number,
          arrFilter: Moviment[],
        ) => {
          return arrFilter.filter((el) => {
            const dateElement = new Date(el.F2_EMISSAO)
            const dateIni = new Date()

            dateIni.setDate(dateIni.getDate() - daysFilterIni)
            const dateFim = new Date()

            dateFim.setDate(dateFim.getDate() - daysFilterFim)
            return dateElement >= dateIni && dateElement <= dateFim
          })
        }

        const moviment: Moviment[] = filterMonth(daysIni, daysFim, arr)

        const mes: { TOTAL: number } = {
          TOTAL: 0,
        }

        moviment.forEach((el) => {
          mes.TOTAL += el.F2_VALMERC
        })

        return mes.TOTAL
      }

      const media = sumMedia(movimentos)
      const mes01 = sumMoviment(movimentos, 89, 60)
      const mes02 = sumMoviment(movimentos, 59, 30)
      const mes03 = sumMoviment(movimentos, 30, 0)

      return {
        VARIACAO:
          ((mes01 / media - 1 + (mes02 / media - 1) + (mes03 / media - 1)) /
            3) *
          100,
      }
    } catch (error) {
      return 402
    }
  }

  // RETORNA TODOS DADOS INICIAIS PARA O PROGRAMA
  async getInitial(
    dateIni: string,
    dateFim: string,
    admin: boolean = false,
    seller: string = '',
  ) {
    if (!dateIni || !dateFim || admin == null || admin === undefined) return 401
    console.log(admin)
    let devolutions: SD1[]
    let sales: SD2[]
    let margemMes: number = 0
    let totalDevolutionMes: number = 0
    let totalSalesMes: number = 0
    let margemDia: number = 0
    let totalDevolutionDia: number = 0
    let totalSalesDia: number = 0
    let custoDia: number = 0
    let custoMes: number = 0

    if (admin) {
      try {
        devolutions = await model.getSD1('', '99999', dateIni, dateFim, false)
        sales = await model.getSD2('', '999999', dateIni, dateFim, false)
      } catch (error) {
        return 402
      }
    } else {
      try {
        const userCod = seller !== '' ? seller : await this.getSellerCod()
        devolutions = await model.getSD1(
          userCod,
          userCod,
          dateIni,
          dateFim,
          false,
        )
        sales = await model.getSD2(userCod, userCod, dateIni, dateFim, false)
      } catch (error) {
        console.log('error')
        return 402
      }
    }

    sales.forEach((el) => {
      const date = new Date(el.D2_EMISSAO)
      const date1 = new Date()
      date1.setUTCHours(0, 0, 0, 0)

      custoMes += el.D2_CUSTO1
      totalSalesMes += el.D2_TOTAL

      if (date.getDate() === date1.getDate()) {
        custoDia += el.D2_CUSTO1
        totalSalesDia += el.D2_TOTAL
      }
    })

    devolutions.forEach((el) => {
      const date = new Date(el.D1_DTDIGIT)
      const date1 = new Date()
      date1.setUTCHours(0, 0, 0, 0)

      totalDevolutionMes += el.D1_TOTAL

      if (date.getDate() === date1.getDate()) {
        totalDevolutionDia += el.D1_TOTAL
      }
    })

    margemDia = ((totalSalesDia - custoDia) / totalSalesDia) * 100
    margemMes = ((totalSalesMes - custoMes) / totalSalesMes) * 100

    return {
      SD2: sales,
      SD1: devolutions,
      MES: {
        MARGEM_MES: margemMes,
        SD1_TOTAL: totalDevolutionMes,
        SD2_TOTAL: totalSalesMes - totalDevolutionMes,
      },
      DIA: {
        MARGEM_DIA: margemDia,
        SD1_TOTAL: totalDevolutionDia,
        SD2_TOTAL: totalSalesDia,
        SD2_LIQUIDO: totalSalesDia - totalDevolutionDia,
      },
    }
  }

  async getOrderItem(filial: string, order: string) {
    if (!filial || !order) return 401
    try {
      const data: SC6[] = await model.getSC6(order, filial)
      return data
    } catch (error) {
      return 402
    }
  }

  async getAdminUser(userId: string) {
    if (!userId) return 401
    let admin = false

    try {
      const USR_ID = await model.getSYS_USR_COD(userId)
      if (USR_ID.length <= 0) return 401

      const user = USR_ID[0].USR_ID
      const USR_GROUP = await model.getSYS_GROUP(user)

      USR_GROUP.forEach((el) => {
        if (el.USR_GRUPO === '000022') {
          admin = true
        }
      })

      return {
        access: admin,
      }
    } catch (error) {
      return 402
    }
  }

  async getYearsSales(sellerInit: string, dateIni: string, dateFim: string) {
    try {
      const sd2 = await model.getSD2(
        sellerInit,
        sellerInit,
        dateIni,
        dateFim,
        false,
      )
      const sd1 = await model.getSD1(
        sellerInit,
        sellerInit,
        dateIni,
        dateFim,
        false,
      )
      const primeiraData = parseISO(dateIni)
      const segundaData = parseISO(dateFim)
      const dateDiff =
        Math.ceil(Math.abs(differenceInDays(primeiraData, segundaData)) / 30) -
        1
      const monthNames: any = {
        1: 'Janeiro',
        2: 'Fevereiro',
        3: 'Março',
        4: 'Abril',
        5: 'Maio',
        6: 'Junho',
        7: 'Julho',
        8: 'Agosto',
        9: 'Setembro',
        10: 'Outubro',
        11: 'Novembro',
        12: 'Dezembro',
      }

      const SomaPorMes = <T extends Item>(
        arry: T[],
      ): { ano: string; mes: string; total: number }[] => {
        const resultArray: { ano: string; mes: string; total: number }[] = []
        // Objeto para armazenar as somas dos totais por ano e mês
        const somaPorMes: { [ano: string]: { [mes: string]: number } } = {}

        arry.forEach((item) => {
          const dataEmissao = item.D2_EMISSAO
            ? new Date(item.D2_EMISSAO)
            : item.D1_DTDIGIT
              ? new Date(item.D1_DTDIGIT)
              : null

          if (dataEmissao) {
            const mes = dataEmissao.getUTCMonth() + 1
            const ano = dataEmissao.getUTCFullYear()
            const nomeMes = monthNames[mes]
            const total = item.D2_TOTAL || item.D1_TOTAL || 0

            // Se o ano ainda não foi inicializado, inicialize-o com um objeto vazio
            if (!somaPorMes[ano]) {
              somaPorMes[ano] = {}
            }

            // Se o total para esse mês ainda não foi inicializado, inicialize-o com 0
            if (!somaPorMes[ano][nomeMes]) {
              somaPorMes[ano][nomeMes] = 0
            }

            // Adicione o total ao total do mês e ano correspondentes
            somaPorMes[ano][nomeMes] += total
          }
        })

        // Converter o objeto de soma em um array de objetos
        for (const ano in somaPorMes) {
          for (const mes in somaPorMes[ano]) {
            resultArray.push({ ano, mes, total: somaPorMes[ano][mes] })
          }
        }

        return resultArray
      }
      const monthArry = (months: number, month: number, date: Date) => {
        const arr = Array(Math.abs(months)).fill('')

        // realiza  uma operação para obeservar se continua no mesmo ano
        for (let i = 0; i < arr.length; i++) {
          const index = (i + month) % 12 || 12
          if (i >= 12) {
            arr[i] = `${monthNames[index]} ${date.getUTCFullYear() + 1}`
          } else {
            arr[i] = `${monthNames[index]} ${date.getUTCFullYear()}`
          }
        }

        return arr
      }

      const SD1: any = SomaPorMes(sd1)
      const SD2: any = SomaPorMes(sd2)
      const months = monthArry(
        dateDiff,
        primeiraData.getUTCMonth() + 1,
        primeiraData,
      )

      return {
        lengthDate: dateDiff,
        months,
        SD1,
        SD2,
      }
    } catch (error) {
      return 402
    }
  }

  async getSeller() {
    try {
      const data = await model.getSA3()
      return data
    } catch (error) {
      return 402
    }
  }

  async getCountSC5(seller: string, dateIni: string, dateFim: string) {
    try {
      const deletedOrder = await model.getCountSC5(
        seller,
        dateIni,
        dateFim,
        false,
      )
      const order = await model.getCountSC5(seller, dateIni, dateFim, true)
      return {
        total_deleted: deletedOrder[0].TOTAL,
        total_order: order[0].TOTAL,
      }
    } catch (error) {
      return 402
    }
  }

  async getSellersMonth(dateIni: string, dateFim: string) {
    try {
      const dataSd2 = await model.getSD2('', '999999', dateIni, dateFim, true)
      const dataSd1 = await model.getSD1('', '999999', dateIni, dateFim, true)
      const monthNames: any = {
        1: 'Janeiro',
        2: 'Fevereiro',
        3: 'Março',
        4: 'Abril',
        5: 'Maio',
        6: 'Junho',
        7: 'Julho',
        8: 'Agosto',
        9: 'Setembro',
        10: 'Outubro',
        11: 'Novembro',
        12: 'Dezembro',
      }
      const SomaPorMesPorNome = <
        T extends {
          D2_TOTAL: number
          D2_EMISSAO: string
          A3_NOME: string
          D1_DTDIGIT: string
          D1_TOTAL: number
        },
      >(
        arry: T[],
      ): { nome: string; ano: string; mes: string; total: number }[] => {
        const resultArray: {
          nome: string
          ano: string
          mes: string
          total: number
        }[] = []

        // Objeto para armazenar as somas dos totais por nome, ano e mês
        const somaPorNome: {
          [nome: string]: { [ano: string]: { [mes: string]: number } }
        } = {}

        arry.forEach((item) => {
          const dataEmissao = new Date(
            item.D2_EMISSAO ? item.D2_EMISSAO : item.D1_DTDIGIT,
          )
          const mes = dataEmissao.getUTCMonth() + 1
          const ano = dataEmissao.getUTCFullYear()
          const nomeMes = monthNames[mes]
          const total = item.D2_TOTAL ? item.D2_TOTAL : item.D1_TOTAL

          // Se o nome ainda não foi inicializado, inicialize-o com um objeto vazio
          if (!somaPorNome[item.A3_NOME.trim()]) {
            somaPorNome[item.A3_NOME.trim()] = {}
          }

          // Se o ano ainda não foi inicializado, inicialize-o com um objeto vazio
          if (!somaPorNome[item.A3_NOME.trim()][ano]) {
            somaPorNome[item.A3_NOME.trim()][ano] = {}
          }

          // Se o total para esse mês ainda não foi inicializado, inicialize-o com 0
          if (!somaPorNome[item.A3_NOME.trim()][ano][nomeMes]) {
            somaPorNome[item.A3_NOME.trim()][ano][nomeMes] = 0
          }

          // Adicione o total ao total do mês e ano correspondentes
          somaPorNome[item.A3_NOME.trim()][ano][nomeMes] += total
        })

        // Converter o objeto de soma em um array de objetos
        for (const nome in somaPorNome) {
          for (const ano in somaPorNome[nome]) {
            for (const mes in somaPorNome[nome][ano]) {
              resultArray.push({
                nome,
                ano,
                mes,
                total: somaPorNome[nome][ano][mes],
              })
            }
          }
        }

        return resultArray
      }

      return {
        SD2: SomaPorMesPorNome(dataSd2),
        SD1: SomaPorMesPorNome(dataSd1),
      }
    } catch (error) {
      return 402
    }
  }
}
