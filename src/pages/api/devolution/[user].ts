
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
  const date = req.body.date;
  const admin = req.body.admin;
  

  if(!date || admin==null || admin == undefined) return res.status(401);

  const controller = new Controller(user)
  const data = await controller.getCurrentDevolution(date,admin);
  
  if(data == 402){
    return res.status(402).json({erro: 'erro ao consultar no banco de dados'})
  }
  return res.status(200).json(data);
}
