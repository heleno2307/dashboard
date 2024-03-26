
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
  const dateIni = req.body.dateIni;
  const dateFim =  req.body.dateFim;
  const seller:string = req.body.seller



  if(!dateIni || !dateFim || !seller) return res.status(401).json({error:'erro'});
  const controller = new Controller(user)
  const data = await controller.getYearsSales(seller,dateIni,dateFim);

  if(data == 402){
    return res.status(402).json({error: 'Erro ao consultar no banco de dados'})
 }else{
    return res.status(200).json(data);
  }
  
  
}
