
import Controller from '@/controller/mainController';
import type { NextApiRequest, NextApiResponse } from 'next'


interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string;
  };
}


export default async function  handler(
  req: CustomApiRequest,
  res: NextApiResponse
) {
  const { user } = req.query;
  const filial = req.body.filial;
  const order = req.body.order;
  

  if(!filial || !order) return res.status(401);

  const controller = new Controller(user)
  const data = await controller.getOrderItem(filial,order);
  if(data == 402){
    return res.status(402).json({erro: 'erro ao consultar no banco de dados'})
  }
  return res.status(200).json(data);
}
