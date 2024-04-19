import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    client: string
    loja: string
    admin: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, client, loja, admin } = req.query

  let adminValue = false

  if (admin === 'true') {
    adminValue = true
  }
  const controller = new Controller(user)

  const data = await controller.getClient(client, loja, adminValue)

  if (data === 402) {
    return res
      .status(402)
      .json({ error: 'Error, ao consultar no banco de dados' })
  } else if (data === 401) {
    return res.status(401).json({ error: 'Error, algum parâmetro em branco' })
  }
  return res.status(200).json(data)
}
