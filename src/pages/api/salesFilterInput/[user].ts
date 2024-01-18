
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
  const admin:boolean = req.body.admin
  const filter:string = req.body.filter
  const limit:number = req.body.limit;
  const page:number = req.body.page


  if(!dateIni || !dateFim || admin == null || admin == undefined) return res.status(401).json({error:'erro'});
  console.log({dateIni,dateFim,filter,page,limit,admin})
  const controller = new Controller(user)
  const data = await controller.getSalesFilterInput(dateIni,dateFim,admin,filter,page,limit);

  if(data == 402){
    return res.status(402).json({erro: 'erro ao consultar no banco de dados'})
  }else  if(data == 401){
   return res.status(401).json({erro: 'filtro não informado'})
 }
  return res.status(200).json(data);
}
