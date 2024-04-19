import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    dateIni: string
    dateFim: string
    seller: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, dateFim, dateIni, seller } = req.query

  if (!dateIni || !dateFim || !seller)
    return res.status(401).json({ error: 'erro' })
  const controller = new Controller(user)
  const data = await controller.getCountSC5(seller, dateIni, dateFim)

  if (data === 402) {
    return res
      .status(402)
      .json({ error: 'Erro ao consultar no banco de dados' })
  } else {
    return res.status(200).json(data)
  }
}
