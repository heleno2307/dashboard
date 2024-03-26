
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
  if(!user) return  res.status(401).json({error: 'Há um ou mais parâmetros faltando'})
  const controller = new Controller(user)
  const data = await controller.getSeller();

  if(data == 402){
    return res.status(402).json({error: 'Erro ao consultar no banco de dados'})
 }else{
    return res.status(200).json(data);
  }
  
  
}
