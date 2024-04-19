import type { NextApiRequest, NextApiResponse } from 'next'

import Controller from '@/controller/mainController'

interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string
    page: string
    limit: string
    filter: string
    admin: string
  }
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse,
) {
  const { user, filter, limit, page, admin } = req.query
  const controller = new Controller(user)

  let adminValue = false
  if (admin === 'true') {
    adminValue = true
  }

  const data = await controller.getClientsFilter(
    adminValue,
    Number(page),
    Number(limit),
    filter,
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
