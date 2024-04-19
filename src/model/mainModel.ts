import sql, { ConnectionPool, Int, VarChar } from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_IP ? process.env.DB_IP : '123',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 200000,
}

export default class Model {
  constructor() {}

  // RETORNA O USUARIO
  async getName(loginUser: string): Promise<sql.IRecordSet<any>> {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool.request().input('login', VarChar, loginUser)
        .query(`
         USE TMPRD;
            SELECT
               USR_CODIGO,
               USR_ID,
               (SELECT A3_COD FROM SA3010(NOLOCK) WHERE A3_CODUSR = USR_ID  AND SA3010.D_E_L_E_T_='') AS 'A3_COD'
            FROM	
               SYS_USR (NOLOCK)
            WHERE 
               USR_ID = @login OR USR_CODIGO= @login
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA PEDIDO DE VENDAS
  async getSales(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    pageSize: number,
    page: number,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, page).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            SELECT
               C5_NOMECLI,
               C5_CLIENTE,
               C5_CONDPAG,
               C5_TRANSP,
               CAST(C5_EMISSAO AS DATE) AS C5_EMISSAO,
               C5_NOTA,
               C5_ZSTSOSS,
               C5_FILIAL,
               C5_ZSEPARA,
               (SELECT USR_CODIGO FROM SYS_USR (NOLOCK) WHERE SYS_USR.D_E_L_E_T_='' AND USR_ID = C5_ZSEPARA) AS'USR_CODIGO',
               C5_ZHORA,
               (SELECT SUM(C6_VALOR) FROM SC6010 (NOLOCK) WHERE SC6010.D_E_L_E_T_='' AND C6_NUM = C5_NUM AND C6_FILIAL = C5_FILIAL) AS 'C6_VALOR',
               C5_NUM,
               C5_ZVERSAO
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
            ORDER BY 
               C5_EMISSAO DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSalesNf(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    pageSize: number,
    page: number,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, page).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            SELECT
               C5_NOMECLI,
               C5_CLIENTE,
               C5_CONDPAG,
               C5_TRANSP,
               CAST(C5_EMISSAO AS DATE) AS C5_EMISSAO,
               C5_NOTA,
               C5_ZSTSOSS,
               C5_FILIAL,
               C5_ZSEPARA,
               (SELECT USR_CODIGO FROM SYS_USR (NOLOCK) WHERE SYS_USR.D_E_L_E_T_='' AND USR_ID = C5_ZSEPARA) AS'USR_CODIGO',
               C5_ZHORA,
               (SELECT SUM(C6_VALOR) FROM SC6010 (NOLOCK) WHERE SC6010.D_E_L_E_T_='' AND C6_NUM = C5_NUM AND C6_FILIAL = C5_FILIAL) AS 'C6_VALOR',
               C5_NUM,
               C5_ZVERSAO
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_NOTA != ''
            ORDER BY 
               C5_EMISSAO DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSalesNf(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               COUNT(*) AS CONT
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_NOTA != ''
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSalesAdd(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    pageSize: number,
    page: number,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, page).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            SELECT
               C5_NOMECLI,
               C5_CLIENTE,
               C5_CONDPAG,
               C5_TRANSP,
               CAST(C5_EMISSAO AS DATE) AS C5_EMISSAO,
               C5_NOTA,
               C5_ZSTSOSS,
               C5_FILIAL,
               C5_ZSEPARA,
               (SELECT USR_CODIGO FROM SYS_USR (NOLOCK) WHERE SYS_USR.D_E_L_E_T_='' AND USR_ID = C5_ZSEPARA) AS'USR_CODIGO',
               C5_ZHORA,
               (SELECT SUM(C6_VALOR) FROM SC6010 (NOLOCK) WHERE SC6010.D_E_L_E_T_='' AND C6_NUM = C5_NUM AND C6_FILIAL = C5_FILIAL) AS 'C6_VALOR',
               C5_NUM,
               C5_ZVERSAO
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_ZSTSOSS IN ('ADD','ALT')
            ORDER BY 
               C5_EMISSAO DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSalesAdd(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               COUNT(*) AS CONT
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_ZSTSOSS IN ('ADD','ALT')
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSalesFilter(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    pageSize: number,
    page: number,
    filter: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('FILTER', VarChar, filter)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, page).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            SELECT
               C5_NOMECLI,
               C5_CLIENTE,
               C5_CONDPAG,
               C5_TRANSP,
               CAST(C5_EMISSAO AS DATE) AS C5_EMISSAO,
               C5_NOTA,
               C5_ZSTSOSS,
               C5_FILIAL,
               C5_ZSEPARA,
               (SELECT USR_CODIGO FROM SYS_USR (NOLOCK) WHERE SYS_USR.D_E_L_E_T_='' AND USR_ID = C5_ZSEPARA) AS'USR_CODIGO',
               C5_ZHORA,
               (SELECT SUM(C6_VALOR) FROM SC6010 (NOLOCK) WHERE SC6010.D_E_L_E_T_='' AND C6_NUM = C5_NUM AND C6_FILIAL = C5_FILIAL) AS 'C6_VALOR',
               C5_NUM,
               C5_ZVERSAO
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_ZSTSOSS = @FILTER
               AND C5_NOTA = ''
            ORDER BY 
               C5_EMISSAO DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSales(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               COUNT(*) AS CONT
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSalesFilter(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    filter: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('FILTER', VarChar, filter).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               COUNT(*) AS CONT
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND C5_ZSTSOSS = @FILTER
               AND C5_NOTA = ''
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSalesInput(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    pageSize: number,
    page: number,
    value: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, page)
        .input('VALUES', VarChar, `%${value}%`).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            SELECT
               C5_NOMECLI,
               C5_CLIENTE,
               C5_CONDPAG,
               C5_TRANSP,
               CAST(C5_EMISSAO AS DATE) AS C5_EMISSAO,
               C5_NOTA,
               C5_ZSTSOSS,
               C5_FILIAL,
               C5_ZSEPARA,
               (SELECT USR_CODIGO FROM SYS_USR (NOLOCK) WHERE SYS_USR.D_E_L_E_T_='' AND USR_ID = C5_ZSEPARA) AS'USR_CODIGO',
               C5_ZHORA,
               (SELECT SUM(C6_VALOR) FROM SC6010 (NOLOCK) WHERE SC6010.D_E_L_E_T_='' AND C6_NUM = C5_NUM AND C6_FILIAL = C5_FILIAL) AS 'C6_VALOR',
               C5_NUM,
               C5_ZVERSAO
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND (C5_NOMECLI LIKE @VALUES OR C5_NOTA LIKE @VALUES OR C5_FILIAL LIKE @VALUES OR C5_NUM LIKE @VALUES OR C5_CLIENTE LIKE @VALUES)
            ORDER BY 
               C5_EMISSAO DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSalesInput(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    value: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim)
        .input('VALUES', VarChar, `%${value}%`).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD + A1_LOJA AS 'A1_CLIENTE' INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               COUNT(*) AS CONT
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_=''
               AND C5_VEND1 BETWEEN @SELLER AND @SELLER1
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_CLIENTE FROM #FILIAIS(NOLOCK))
               AND (C5_NOMECLI LIKE @VALUES OR C5_NOTA LIKE @VALUES OR C5_FILIAL LIKE @VALUES OR C5_NUM LIKE @VALUES OR C5_CLIENTE LIKE @VALUES)         
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA DEVOLUCAO DETALHADA
  async getDevolutionDatails(
    loginUser: string,
    loginUser1: string,
    date: string,
  ): Promise<sql.IRecordSet<any>> {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, loginUser)
        .input('VENDEDOR1', VarChar, loginUser1)
        .input('ENTRADA', VarChar, date).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               	D1_FILIAL ,
                  D1_DOC,
                  SUM(D1_TOTAL) AS D1_TOTAL,
                  D2_DOC,
                  CAST(D2_EMISSAO AS DATE) AS D2_EMISSAO ,
                  A1_NOME,
                  C5_VEND1,
                  A3_NOME
            
            FROM
               SD1010 (NOLOCK)
            
               INNER JOIN SD2010 (NOLOCK)
               ON D2_FILIAL = D1_FILIAL
               AND D2_DOC = D1_NFORI
               AND D2_SERIE = D1_SERIORI
               AND D2_ITEM = D1_ITEMORI
            
               INNER JOIN SC5010 (NOLOCK)
               ON C5_FILIAL = D2_FILIAL
               AND C5_NUM = D2_PEDIDO
            
               INNER JOIN SA1010 (NOLOCK)
               ON A1_COD = C5_CLIENTE
               AND A1_LOJA = C5_LOJACLI
            
               INNER JOIN SA3010 (NOLOCK)
               ON A3_COD = C5_VEND1
            
            
            WHERE
               SD1010.D_E_L_E_T_ = ''
               AND D1_TIPO = 'D'
               AND D1_DTDIGIT = @ENTRADA
               AND SD2010.D_E_L_E_T_ = ''
               AND SC5010.D_E_L_E_T_ = ''
               AND C5_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND SA1010.D_E_L_E_T_ = ''
               AND SA3010.D_E_L_E_T_ = ''
               AND C5_CLIENTE + C5_LOJACLI NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
            
            GROUP BY
               D1_FILIAL,
               D1_DOC,
               D2_DOC,
               D2_EMISSAO,
               A1_NOME,
               C5_VEND1,
               A3_NOME
            
            ORDER BY
               C5_VEND1,
               D2_EMISSAO;
                  
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA LISTA DE CLIENTES
  async getClients(
    sellerCod: string = '',
    dateIni: string,
    sellerCod1: string = sellerCod,
    pageSize: number,
    page: number,
  ) {
    try {
      const checkPage = page != 0 ? page : 1
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCod)
        .input('VENDEDOR1', VarChar, sellerCod1)
        .input('DATEINI', VarChar, dateIni)
        .input('pageSize', Int, pageSize)
        .input('pageNumber', Int, checkPage).query(`
            USE TMPRD;

            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            
            SELECT
               SUM(F2_VALMERC) AS TOTAL,
               F2_CLIENTE AS D2_CLIENTE,
               A1_NOME AS NOME,
               A1_LOJA,
               CAST(A1_ULTCOM AS DATE) AS A1_ULTCOM,
               A1_TEL,
               A1_EMAIL
            
            FROM
               SF2010 (NOLOCK)
            
               INNER JOIN SA1010 (NOLOCK)
               ON A1_COD = F2_CLIENTE
               AND A1_LOJA = F2_LOJA
            
            WHERE
               SF2010.D_E_L_E_T_=''
               AND SA1010.D_E_L_E_T_=''
               AND F2_EMISSAO >= @DATEINI
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND F2_TIPO = 'N'
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
            
            GROUP BY
               F2_CLIENTE,
               A1_NOME,
               A1_LOJA,
               A1_ULTCOM,
               A1_TEL,
               A1_EMAIL
            
            ORDER BY
               TOTAL DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountClients(
    sellerCod: string = '',
    dateIni: string,
    sellerCod1: string = sellerCod,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCod)
        .input('VENDEDOR1', VarChar, sellerCod1)
        .input('DATEINI', VarChar, dateIni).query(`
            USE TMPRD;

            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            IF OBJECT_ID('tempdb..#REGISTER') IS NOT NULL DROP TABLE #REGISTER;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            
            SELECT
               COUNT(*) AS 'QTD'
            INTO
               #REGISTER
            FROM
               SF2010 (NOLOCK)
            
               INNER JOIN SA1010 (NOLOCK)
               ON A1_COD = F2_CLIENTE
               AND A1_LOJA = F2_LOJA
            
            WHERE
               SF2010.D_E_L_E_T_=''
               AND SA1010.D_E_L_E_T_=''
               AND F2_EMISSAO >= @DATEINI
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND F2_TIPO = 'N'
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
            GROUP BY
               F2_CLIENTE,
               A1_NOME,
               A1_LOJA,
               A1_ULTCOM,
               A1_TEL,
               A1_EMAIL;

            SELECT COUNT(*) AS 'CONT' FROM #REGISTER
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getClientsFilter(
    sellerCod: string = '',
    dateIni: string,
    sellerCod1: string = sellerCod,
    pageSize: number,
    page: number,
    filter: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCod)
        .input('VENDEDOR1', VarChar, sellerCod1)
        .input('DATEINI', VarChar, dateIni)
        .input('pageSize', Int, pageSize)
        .input('FILTER', VarChar, `%${filter}%`)
        .input('pageNumber', Int, page).query(`
            USE TMPRD;

            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            
            SELECT
               SUM(F2_VALMERC) AS TOTAL,
               F2_CLIENTE AS D2_CLIENTE,
               A1_NOME AS NOME,
               A1_LOJA,
               CAST(A1_ULTCOM AS DATE) AS A1_ULTCOM,
               A1_TEL,
               A1_EMAIL
            
            FROM
               SF2010 (NOLOCK)
            
               INNER JOIN SA1010 (NOLOCK)
               ON A1_COD = F2_CLIENTE
               AND A1_LOJA = F2_LOJA
            
            WHERE
               SF2010.D_E_L_E_T_=''
               AND SA1010.D_E_L_E_T_=''
               AND F2_EMISSAO >= @DATEINI
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND F2_TIPO = 'N'
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
               AND (F2_CLIENTE LIKE @FILTER OR A1_NOME LIKE @FILTER)
            
            GROUP BY
               F2_CLIENTE,
               A1_NOME,
               A1_LOJA,
               A1_ULTCOM,
               A1_TEL,
               A1_EMAIL
            
            ORDER BY
               TOTAL DESC
            OFFSET @pageSize * (@pageNumber - 1) ROWS
            FETCH NEXT @pageSize ROWS ONLY;
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountClientsFilter(
    sellerCod: string = '',
    dateIni: string,
    sellerCod1: string = sellerCod,
    filter: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCod)
        .input('FILTER', VarChar, `%${filter}%`)
        .input('VENDEDOR1', VarChar, sellerCod1)
        .input('DATEINI', VarChar, dateIni).query(`
            USE TMPRD;

            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            IF OBJECT_ID('tempdb..#REGISTER') IS NOT NULL DROP TABLE #REGISTER;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            
            SELECT
               COUNT(*) AS 'QTD'
            INTO
               #REGISTER
            FROM
               SF2010 (NOLOCK)
            
               INNER JOIN SA1010 (NOLOCK)
               ON A1_COD = F2_CLIENTE
               AND A1_LOJA = F2_LOJA
            
            WHERE
               SF2010.D_E_L_E_T_=''
               AND SA1010.D_E_L_E_T_=''
               AND F2_EMISSAO >= @DATEINI
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND F2_TIPO = 'N'
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
               AND (F2_CLIENTE LIKE @FILTER OR A1_NOME LIKE @FILTER)
            GROUP BY
               F2_CLIENTE,
               A1_NOME,
               A1_LOJA,
               A1_ULTCOM,
               A1_TEL,
               A1_EMAIL;

            SELECT COUNT(*) AS 'CONT' FROM #REGISTER
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA TODAS MOVIMENTACOES DO CLIENTE
  async getClient(
    sellerCod: string,
    sellerCod1: string,
    date: string,
    loja: string,
    clientCod: string,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCod)
        .input('VENDEDOR1', VarChar, sellerCod1)
        .input('DATE', VarChar, date)
        .input('LOJA', VarChar, loja)
        .input('CLIENTE', VarChar, clientCod).query(`
            USE TMPRD;
            SELECT
               CAST(F2_EMISSAO AS DATE) AS F2_EMISSAO,
               F2_VALMERC
            
            FROM
               SF2010 (NOLOCK)
            WHERE
               SF2010.D_E_L_E_T_=''
               AND F2_EMISSAO >= @DATE
               AND F2_CLIENTE = @CLIENTE
               AND F2_LOJA = @LOJA
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
               AND F2_TIPO = 'N'
            ORDER BY
               F2_EMISSAO
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA DADOS DE DEVOLUCAO
  async getSD1(
    sellerCodIni: string,
    sellerCodFim: string,
    dateIni: string,
    dateFim: string,
    groupSeller: boolean = false,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('VENDEDOR', VarChar, sellerCodIni)
        .input('VENDEDOR1', VarChar, sellerCodFim)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;

            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';
            
            SELECT
               CAST(D1_DTDIGIT AS DATE) AS 'D1_DTDIGIT',
               SUM(D1_TOTAL) AS 'D1_TOTAL'
               ${groupSeller ? ",(SELECT A3_NOME FROM SA3010 (NOLOCK) WHERE SA3010.D_E_L_E_T_='' AND A3_COD = F2_VEND1) AS A3_NOME" : ''}
            FROM
               SD1010 (NOLOCK)
            
               INNER JOIN SD2010 (NOLOCK)
               ON D2_FILIAL = D1_FILIAL
               AND D2_DOC = D1_NFORI
               AND D2_SERIE = D1_SERIORI
               AND D2_ITEM = D1_ITEMORI
            
               INNER JOIN SF2010 (NOLOCK)
               ON D2_FILIAL = F2_FILIAL
               AND D2_DOC = F2_DOC
               AND D2_SERIE = F2_SERIE
               AND D2_CLIENTE = F2_CLIENTE
               AND D2_LOJA = F2_LOJA
               AND D2_FORMUL = F2_FORMUL
               AND D2_TIPO = F2_TIPO
            
            WHERE
               SD1010.D_E_L_E_T_ = ''
               AND D1_TIPO = 'D'
               AND D1_DTDIGIT BETWEEN @DATE AND @DATE1
               AND SD2010.D_E_L_E_T_ = ''
               AND SF2010.D_E_L_E_T_ = ''
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
               AND F2_VEND1 BETWEEN @VENDEDOR AND @VENDEDOR1
            
            GROUP BY
               D1_DTDIGIT
               ${groupSeller ? ', F2_VEND1' : ''}
            ;
         `)
      return result.recordset
    } catch (err: any) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  // RETORNA DADOS DE
  async getSD2(
    sellerCod: string,
    sellerCod1: string,
    dateIni: string,
    dateFim: string,
    groupSeller: boolean,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, sellerCod)
        .input('SELLER1', VarChar, sellerCod1)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;
            IF OBJECT_ID('tempdb..#FILIAIS') IS NOT NULL DROP TABLE #FILIAIS;
            
            SELECT A1_COD, A1_LOJA INTO #FILIAIS FROM SA1010 (NOLOCK) WHERE SA1010.D_E_L_E_T_ = '' AND A1_FILTRF <> '';

            SELECT
               SUM(D2_TOTAL) D2_TOTAL,
               SUM(D2_CUSTO1) D2_CUSTO1,
               CAST(D2_EMISSAO AS DATE) AS D2_EMISSAO
               ${groupSeller ? ",(SELECT A3_NOME FROM SA3010 (NOLOCK) WHERE SA3010.D_E_L_E_T_='' AND A3_COD = F2_VEND1) AS A3_NOME" : ''}
            FROM
               SF2010 (NOLOCK)
               INNER JOIN SD2010 (NOLOCK)
               ON D2_FILIAL = F2_FILIAL
               AND D2_DOC = F2_DOC
               AND D2_SERIE = F2_SERIE
               AND D2_CLIENTE = F2_CLIENTE
               AND D2_LOJA = F2_LOJA
               AND D2_FORMUL = F2_FORMUL
               AND D2_TIPO = F2_TIPO
            WHERE
               SF2010.D_E_L_E_T_ = ''
               AND SD2010.D_E_L_E_T_= ''
               AND F2_VEND1 BETWEEN @SELLER AND @SELLER1
               AND F2_EMISSAO BETWEEN @DATE AND @DATE1
               AND F2_CLIENTE + F2_LOJA NOT IN (SELECT #FILIAIS.A1_COD + A1_LOJA FROM #FILIAIS)
               AND F2_TIPO = 'N'
            GROUP BY
               D2_EMISSAO
               ${groupSeller ? ', F2_VEND1' : ''}
            ORDER BY
               D2_EMISSAO;
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSC6(order: string, filial: string) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('PEDIDO', VarChar, order)
        .input('FILIAL', VarChar, filial).query(`
            USE TMPRD;
            SELECT
               C6_ITEM,
               C6_PRODUTO,
               C6_PRCVEN,
               C6_VALOR,
               C6_TES,
               C6_QTDVEN,
               (SELECT B1_DESC FROM SB1010 (NOLOCK) WHERE SB1010.D_E_L_E_T_='' AND B1_COD = C6_PRODUTO) AS 'B1_DESC'
            FROM 
               SC6010 (NOLOCK)
            WHERE
               SC6010.D_E_L_E_T_=''
               AND C6_NUM = @PEDIDO
               AND C6_FILIAL = @FILIAL
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSYS_GROUP(userId: string) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool.request().input('USUARIO', VarChar, userId)
        .query(`
            USE TMPRD;
            SELECT
               USR_GRUPO
            FROM
               SYS_USR_GROUPS
            WHERE
               USR_ID = @USUARIO
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSYS_USR_COD(userId: string) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool.request().input('USUARIO', VarChar, userId)
        .query(`
            USE TMPRD;
            SELECT
               USR_ID
            FROM
               SYS_USR
            WHERE
               USR_ID = @USUARIO OR USR_CODIGO = @USUARIO
               
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getSA3() {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool.request().query(`
            USE TMPRD;
            SELECT
               A3_COD,
               A3_NOME
            FROM
               SA3010 (NOLOCK)
            WHERE
               SA3010.D_E_L_E_T_ = ''
            ORDER BY
               A3_NOME
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }

  async getCountSC5(
    seller: string,
    dateIni: string,
    dateFim: string,
    existOrder: boolean,
  ) {
    try {
      const pool = await new ConnectionPool(config).connect()
      const result = await pool
        .request()
        .input('SELLER', VarChar, seller)
        .input('DATE', VarChar, dateIni)
        .input('DATE1', VarChar, dateFim).query(`
            USE TMPRD;
            SELECT
               COUNT(*) AS 'TOTAL'
            FROM
               SC5010 (NOLOCK)
            WHERE
               SC5010.D_E_L_E_T_='${existOrder ? '' : '*'}'
               AND C5_EMISSAO BETWEEN @DATE AND @DATE1
               AND C5_VEND1 = @SELLER
         `)
      return result.recordset
    } catch (err) {
      console.error('Erro ao executar a consulta:', err)
      throw err
    }
  }
}
