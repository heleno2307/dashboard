import Controller from '@/controller/mainController'
import type { NextApiRequest, NextApiResponse } from 'next'

interface CustomApiRequest extends NextApiRequest {
  query: {
    id: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query
  const controller = new Controller(id)
  const data = await controller.getUser()

  if (data == 402) {
    return res
      .status(402)
      .json({ error: 'falha ao consultar o banco de dados' })
  } else if (data == 401) {
    return res.status(401).json({ error: 'O parâmetro enviado está em branco' })
  } else {
    return res.status(200).json(data)
  }
}
