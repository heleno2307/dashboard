import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    dateFim: string
    admin: string
    filter: string
    limit: string
    page: string
    dateIni: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, admin, dateFim, dateIni, filter, limit, page } = req.query

  const adminValue = admin === 'true'
  const controller = new Controller(user)
  const data = await controller.getSalesFilterInput(
    dateIni,
    dateFim,
    adminValue,
    filter,
    Number(page),
    Number(limit),
  )

  if (data === 402) {
    return res
      .status(402)
      .json({ error: 'Erro ao consultar no banco de dados' })
  } else if (data === 401) {
    return res.status(401).json({ error: 'Error, algum parâmetro em branco' })
  } else {
    return res.status(200).json(data)
  }
}
