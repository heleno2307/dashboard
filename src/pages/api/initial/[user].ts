import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    dateIni: string
    admin: string
    dateFim: string
    seller: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, dateIni, admin, dateFim, seller } = req.query
  let adminValue = false

  if (admin === 'true') {
    adminValue = true
  }
  const controller = new Controller(user)
  const data = await controller.getInitial(dateIni, dateFim, adminValue, seller)

  if (data === 402) {
    return res
      .status(402)
      .json({ error: 'erro ao consultar no banco de dados' })
  } else if (data === 401) {
    return res.status(401).json({ error: 'Erro, algum parâmetro em branco' })
  } else {
    return res.status(200).json(data)
  }
}
