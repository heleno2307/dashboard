
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
  const admin:boolean = req.body.admin
  const dateFim =  req.body.dateFim;

  const controller = new Controller(user)
  const data = await controller.getInitial(dateIni,dateFim,admin);
  
  if(data == 402){
    return res.status(402).json({error: 'erro ao consultar no banco de dados'})
  }else if(data == 401){
    return res.status(401).json({error:'Erro, algum parâmetro em branco'});
  }else{
    return res.status(200).json(data);
  }
  
}
