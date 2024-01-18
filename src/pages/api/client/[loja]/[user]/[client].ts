
import Controller from '@/controller/mainController';
import type { NextApiRequest, NextApiResponse } from 'next'


interface CustomApiRequest extends NextApiRequest {
  query: {
    user: string;
    client:string
    loja:string
  };
}


export default async function  handler(
  req: CustomApiRequest,
  res: NextApiResponse
) {
  const { user,client,loja } = req.query;
  const admin = req.body.admin
  const controller = new Controller(user)
  if(admin == null || admin == undefined) return res.status(401)
  
  const data = await controller.getClient(client,loja,admin);

  if(data == 402){
    return res.status(402).json({erro: 'erro ao consultar no banco de dados'})
  }
  return res.status(200).json(data);
}
