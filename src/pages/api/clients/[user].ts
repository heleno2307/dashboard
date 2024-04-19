import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    limit: string
    page: string
    admin: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, limit, page, admin } = req.query
  const controller = new Controller(user)

  let adminValue = false
  if (admin === 'true') {
    adminValue = true
  }

  const data = await controller.getClients(
    adminValue,
    Number(page),
    Number(limit),
  )
  if (data === 402) {
    return res.status(402).json({ erro: 'erro ao consultar no banco de dados' })
  } else if (data === 401) {
    return res.status(401).json({ error: 'Error, algum parâmetro em branco' })
  } else {
    return res.status(200).json(data)
  }
}
