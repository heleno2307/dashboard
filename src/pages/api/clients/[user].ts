
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
  const admin:boolean = req.body.admin;
 

  const { user } = req.query;
  const controller = new Controller(user);
  const limit:number = req.body.limit;
  const page:number = req.body.page;

  const data = await controller.getClients(admin,page,limit);
  if(data == 402){
    return res.status(402).json({erro: 'erro ao consultar no banco de dados'})
  }else if(data == 401){
    return  res.status(401).json({error:'Error, algum parâmetro em branco'});
  }else{
    return res.status(200).json(data);
  }
  
}
