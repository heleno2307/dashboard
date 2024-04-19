import Controller from '@/controller/mainController'
import type { NextApiRequest, NextApiResponse } from 'next'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user } = req.query
  const date = req.body.date
  const admin = req.body.admin
  const seller = req.body.seller

  const controller = new Controller(user)
  const data = await controller.getCurrentDevolution(date, admin, seller)

  if (data == 402) {
    return res
      .status(402)
      .json({ error: 'Erro ao consultar no banco de dados' })
  } else if (data == 401) {
    return res.status(401).json({ error: 'Error, algum parâmetro em branco' })
  } else {
    return res.status(200).json(data)
  }
}
