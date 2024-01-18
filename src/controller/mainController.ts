import Model from "@/model/mainModel";
import { somarDias, subtrairDias } from "@/utilities/subtrairDias";

const model = new Model();

type UserData = {
   A3_COD:string;
   USR_CODIGO:string;
   USR_ID:string
}

type SD2 = {
   D2_TOTAL:number;
   D2_CUSTO1:number;
   D2_EMISSAO:string
}

type Sales = {
   C5_NOMECLI:string;
   C5_CLIENTE:string;
   C5_CONDPAG:string;
   E4_DESCRI:string;
   C5_NOTA:string;
   C5_EMISSAO:string;
   C5_ZSTOSS:string;
   C5_FILIAL:string;
   C5_ZSEPARA:string;
   C5_ZHORA:string;
   C6_VALOR:number;
   USR_CODIGO:string
   C5_NUM:String;
   C5_ZVERSAO:string;
}
type CurrentDevolution = {
   D1_FILIAL:string;
   D1_DOC:string;
   D1_TOTAL:number;
   D2_DOC:string;
   D2_EMISSAO:string;
   A1_NOME:string;
   C5_VEND1:string;
   A3_NOME:string
}
type Moviment = {
   F2_EMISSAO:string
   F2_VALMERC:number
}

type SD1 = {
   D1_FILIAL:string;
   D1_DOC:string;
   F2_DOC:string;
   D1_DTDIGIT:string;
   F2_VALMERC:number;
   F2_EMISSAO:string;
   A1_NOME:string;
   F2_VEND1:string;
   D1_TOTAL:number;
}

type SC6 = {
   C6_ITEM:string;
   C6_PRODUTO:string;
   C6_PRCVEN:number
   C6_VALOR:number
   C6_TES:string
   C6_QTDVEN:number
}


export default class Controller  {
   private loginUser: string;
   
   constructor(loginUser:string){
      this.loginUser = loginUser.toLocaleUpperCase();
   }

   //RETORNA O USUARIO
   async getUser(){
      if(!this.loginUser.trim()) return 402;  
      const data:{}[] = await model.getName(this.loginUser);
      return data;
   }

   //RETORNA UMA LISTA DE PEDIDOS
   async getSales(dateIni:string,dateFim:string,admin:boolean =false,page:number=1,limitUser:number=15){
      if(!dateIni.trim() || !dateFim.trim()) return;
      if(admin){
         try {
            const registerData = await model.getCountSales('','999999',dateIni,dateFim);
            const register = registerData[0].CONT;

            if(register !== 0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const data:Sales[] = await model.getSales('','999999',dateIni,dateFim,limit,page);
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: data.length,
                  SC5:data                  
               };

            }else{
               return {
                  last_Page:false,
                  page,
                  next_page: false,
                  qtd_register: register,
                  qtd_result: 0,
                  SC5:[]                  
               };
            }
          } catch (error) {
            return 402;
         }
      }else{
         try {
           const userCod =  await this.getUserCod();
           const registerData = await model.getCountSales(userCod,userCod,dateIni,dateFim,);
           const register = registerData[0].CONT;
           if(register !== 0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const data:Sales[] = await model.getSales(userCod,userCod,dateIni,dateFim,limit,page);
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: data.length,
                  SC5:data                  
               };

           }else{
            return {
               last_Page:false,
               page,
               next_page: false,
               qtd_register: register,
               qtd_result: 0,
               SC5:[]                  
            };
           }
         } catch (error) {
            return 402;
         }
      }
   
   }

   async getSalesFilter (dateIni:string,dateFim:string,admin:boolean =false,filter:string,page:number=1,limitUser:number=15){
      if(!filter.trim())return 401

      if(admin){
         if(filter.trim().toUpperCase() == 'NF'){
            try {
               const registerData = await model.getCountSalesNf('','999999',dateIni,dateFim);
               const register = registerData[0].CONT;
   
               if(register !== 0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const data:Sales[] = await model.getSalesNf('','999999',dateIni,dateFim,limit,page);
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: data.length,
                     SC5:data                  
                  };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SC5:[]                  
                  };
               }
   
            } catch (error) {
               return 402
            }
         }else if(filter.trim().toUpperCase() == 'ADD' || filter.trim().toUpperCase() == 'ALT'){
            try {
               const registerData = await model.getCountSalesAdd('','999999',dateIni,dateFim);
               const register = registerData[0].CONT;
   
               if(register !== 0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const data:Sales[] = await model.getSalesAdd('','999999',dateIni,dateFim,limit,page);
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: data.length,
                     SC5:data                  
                  };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SC5:[]                  
                  };
               }
   
            } catch (error) {
               return 402
            }
         }else{
            try {
               const registerData = await model.getCountSalesFilter('','999999',dateIni,dateFim,filter.trim().toUpperCase());
               const register = registerData[0].CONT;
   
               if(register !== 0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const data:Sales[] = await model.getSalesFilter('','999999',dateIni,dateFim,limit,page,filter.trim().toUpperCase());
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: data.length,
                     SC5:data                  
                  };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SC5:[]                  
                  };
               }
   
            } catch (error) {
               return 402
            }
         }
         
      }else{
         if(filter.trim().toUpperCase() == 'NF'){
            try {
               const userCod =  await this.getUserCod();
               const registerData = await model.getCountSalesNf(userCod,userCod,dateIni,dateFim);
               const register = registerData[0].CONT;
               console.log(register)
               if(register !== 0){
                   const limit = limitUser > 15? 15 : limitUser
                   const lastPage = Math.ceil(register / limit);
                   const data:Sales[] = await model.getSalesNf(userCod,userCod,dateIni,dateFim,limit,page);
                   return {
                      last_Page:lastPage,
                      page,
                      next_page: page < lastPage ? page + 1 : false,
                      qtd_register: register,
                      qtd_result: data.length,
                      SC5:data                  
                   };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SC5:[]                  
                  };
               }
             } catch (error) {
                return 402;
             }
         }else if(filter.trim().toUpperCase() == 'ADD' || filter.trim().toUpperCase() == 'ALT'){
            try {
               const userCod =  await this.getUserCod();
               const registerData = await model.getCountSalesAdd(userCod,userCod,dateIni,dateFim);
               const register = registerData[0].CONT;
               if(register !== 0){
                   const limit = limitUser > 15? 15 : limitUser
                   const lastPage = Math.ceil(register / limit);
                   const data:Sales[] = await model.getSalesAdd(userCod,userCod,dateIni,dateFim,limit,page);
                   return {
                      last_Page:lastPage,
                      page,
                      next_page: page < lastPage ? page + 1 : false,
                      qtd_register: register,
                      qtd_result: data.length,
                      SC5:data                  
                   };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SC5:[]                  
                  };
               }
             } catch (error) {
                return 402;
             }
         }else{
            try {
              const userCod =  await this.getUserCod();
              const registerData = await model.getCountSalesFilter(userCod,userCod,dateIni,dateFim,filter.trim().toUpperCase());
              const register = registerData[0].CONT;
              console.log(register)
              if(register !== 0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const data:Sales[] = await model.getSalesFilter(userCod,userCod,dateIni,dateFim,limit,page,filter.trim().toUpperCase());
                  console.log(data)
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: data.length,
                     SC5:data                  
                  };
              }else{
               return {
                  last_Page:false,
                  page,
                  next_page: false,
                  qtd_register: register,
                  qtd_result: 0,
                  SC5:[]                  
               };
              }
            } catch (error) {
               return 402;
            }
         }
       
      }
   }

   async getSalesFilterInput(dateIni:string,dateFim:string,admin:boolean =false,filter:string,page:number=1,limitUser:number=15){
      if(!dateIni.trim() || !dateFim.trim()) return;
      if(!filter.trim())return 401
      if(admin){
         try {
            const registerData = await model.getCountSalesInput('','999999',dateIni,dateFim,filter.trim().toUpperCase());
            const register = registerData[0].CONT;

            if(register !== 0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const data:Sales[] = await model.getSalesInput('','999999',dateIni,dateFim,limit,page,filter.trim().toUpperCase());
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: data.length,
                  SC5:data                  
               };

            }else{
               return {
                  last_Page:false,
                  page,
                  next_page: false,
                  qtd_register: register,
                  qtd_result: 0,
                  SC5:[]                  
               };
            }
          } catch (error) {
            return 402;
         }
      }else{
         try {
           const userCod =  await this.getUserCod();
           const registerData = await model.getCountSalesInput(userCod,userCod,dateIni,dateFim,filter.trim().toUpperCase());
           const register = registerData[0].CONT;
           if(register !== 0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const data:Sales[] = await model.getSalesInput(userCod,userCod,dateIni,dateFim,limit,page,filter.trim().toUpperCase());
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: data.length,
                  SC5:data                  
               };

           }else{
            return {
               last_Page:false,
               page,
               next_page: false,
               qtd_register: register,
               qtd_result: 0,
               SC5:[]                  
            };
           }
         } catch (error) {
            return 402;
         }
      }
   }

   //RETORNA DEVOLUÇÃO DETALHADA
   async getCurrentDevolution(date:string,admin:boolean){
      if(!date) return;
     
      try {
      
         if(admin){
            const userCod = await this.getUserCod();
            const data:CurrentDevolution[] = await model.getDevolutionDatails('','999999',date);
            return data;
         }else{
            const userCod = await this.getUserCod();
            const data:CurrentDevolution[] = await model.getDevolutionDatails(userCod,userCod,date);
            return data;
         }
         
      } catch (error) {
         return 402;
      }
      
   }

   //RETORNA O CODIGO DE VENDEDOR
   async getUserCod(){
      const user:UserData[] = await model.getName(this.loginUser);
      return user[0].A3_COD;
   }

   //RETORNA UMA LISTA DE CLIENTES E SEUS TOTAIS DE COMPRA
   async getClients(admin:boolean=false,page:number =1,limitUser:number=15){
         const date180 = subtrairDias(180);

         if(admin){
            try {
               const registerData = await model.getCountClients('',date180,'999999');
               const register = registerData[0].CONT;

               
               if(register > 0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const clients = await model.getClients('',date180,'999999',limit,page);
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: clients.length,
                     SA1:clients                  
                  };

               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SA1:[]                  
                  };
               }

            } catch (error) {
               return 402;
            }
           
         }else{
            try {
               const userCod = await this.getUserCod();
               const registerData = await model.getCountClients(userCod,date180,userCod);
               const register = registerData[0].CONT;

               if(register >0){
                  const limit = limitUser > 15? 15 : limitUser
                  const lastPage = Math.ceil(register / limit);
                  const clients = await model.getClients(userCod,date180,userCod,limit,page);
                  return {
                     last_Page:lastPage,
                     page,
                     next_page: page < lastPage ? page + 1 : false,
                     qtd_register: register,
                     qtd_result: clients.length,
                     SA1:clients                  
                  };
               }else{
                  return {
                     last_Page:false,
                     page,
                     next_page: false,
                     qtd_register: register,
                     qtd_result: 0,
                     SA1:[]                  
                  };
               }
               
            } catch (error) {
               return 402;
            }
          
         }  
         
   }

   //RETORNA UMA LISTA DE CLIENTES E SEUS TOTAIS DE COMPRA
   async getClientsFilter(admin:boolean=false,page:number =1,limitUser:number=15,filter:string){
      const date180 = subtrairDias(180);

      if(admin){
         try {
            const registerData = await model.getCountClientsFilter('',date180,'999999',filter.trim().toUpperCase());
            const register = registerData[0].CONT;

            
            if(register > 0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const clients = await model.getClientsFilter('',date180,'999999',limit,page,filter.trim().toUpperCase());
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: clients.length,
                  SA1:clients                  
               };

            }else{
               return {
                  last_Page:false,
                  page,
                  next_page: false,
                  qtd_register: register,
                  qtd_result: 0,
                  SA1:[]                  
               };
            }

         } catch (error) {
            return 402;
         }
        
      }else{
         try {
            const userCod = await this.getUserCod();
            const registerData = await model.getCountClientsFilter(userCod,date180,userCod,filter.trim().toUpperCase());
            const register = registerData[0].CONT;

            if(register >0){
               const limit = limitUser > 15? 15 : limitUser
               const lastPage = Math.ceil(register / limit);
               const clients = await model.getClientsFilter(userCod,date180,userCod,limit,page,filter.trim().toUpperCase());
               return {
                  last_Page:lastPage,
                  page,
                  next_page: page < lastPage ? page + 1 : false,
                  qtd_register: register,
                  qtd_result: clients.length,
                  SA1:clients                  
               };
            }else{
               return {
                  last_Page:false,
                  page,
                  next_page: false,
                  qtd_register: register,
                  qtd_result: 0,
                  SA1:[]                  
               };
            }
            
         } catch (error) {
            return 402;
         }
       
      }  
      
}

   //RETORNA CALCULO DE VARIAÇÃO DE COMPRA DE UM CLIENTE
   async getClient(codClient:string,loja:string,admin:boolean){
      if(!codClient || !loja) return;
      try {
         const userCod = await this.getUserCod();
         const days = subtrairDias(179);
         let movimentos:Moviment[];
         if(admin){
            movimentos = await model.getClient('','999999',days,loja,codClient);
         }else{
            movimentos = await model.getClient(userCod,userCod,days,loja,codClient);
         }

         //função para calculo de média
         const sumMedia = (arr:Moviment[])=>{
            let count = 0
            arr.forEach(el => {
               count += el.F2_VALMERC
            })
            
            return count / 6;
         }

         //função que soma as movimentações em um determindado intervalo de tempo.
         const sumMoviment = (arr:Moviment[],daysIni:number,daysFim:number)=>{

            //retorna um arry com data de emissão no intervalo de tempo passo via paranmetro
            const filterMonth = (daysFilterIni: number,daysFilterFim: number, arrFilter: Moviment[]) => {
               return arrFilter.filter(el => {
                  const dateElement = new Date(el.F2_EMISSAO);
                  const dateIni =new Date();

                  dateIni.setDate(dateIni.getDate() - daysFilterIni);
                  const dateFim = new Date();

                  dateFim.setDate(dateFim.getDate() - daysFilterFim);
                  return dateElement >= dateIni && dateElement <= dateFim;     
               });
            };

            const moviment:Moviment[]= filterMonth(daysIni,daysFim,arr);
         
            const mes:{TOTAL:number} = {
               TOTAL: 0
            }

            moviment.forEach(el => {
               mes.TOTAL += el.F2_VALMERC;
            });

            return mes.TOTAL;
         }

         const media = sumMedia(movimentos);
         const mes01 = sumMoviment(movimentos,89,60);
         const mes02 = sumMoviment(movimentos,59,30);
         const mes03 = sumMoviment(movimentos,30,0);

         return {
            VARIACAO: (((mes01/media) - 1) + ((mes02/media) - 1) + ((mes03/media) - 1))/3*100
         }
      } catch (error) {
         return 402;
      }
      

   }

   //RETORNA TODOS DADOS INICIAIS PARA O PROGRAMA
   async getInitial(dateIni:string,dateFim:string,admin:boolean){
      if(!dateIni || !dateFim)return

      let devolutions:SD1[];
      let sales:SD2[];
      let margemMes:number = 0;
      let totalDevolutionMes:number = 0;
      let totalSalesMes:number = 0;
      let margemDia:number = 0;
      let totalDevolutionDia:number = 0;
      let totalSalesDia:number = 0;
      let custoDia:number = 0;
      let custoMes:number = 0;

      if(admin){
         try {
            devolutions = await model.getSD1('','99999',dateIni,dateFim);
            sales = await model.getSD2('','999999',dateIni,dateFim);
         } catch (error) {
            return 402;
         }
     
      }else{
         try {
            const userCod = await this.getUserCod();
            devolutions = await model.getSD1(userCod,userCod,dateIni,dateFim);
            sales = await model.getSD2(userCod,userCod,dateIni,dateFim);
         } catch (error) {
            console.log('error');
            return 402;
         }
        
      }

      sales.forEach((el)=>{
         const date = new Date(el.D2_EMISSAO);
         const date1 = new Date()
         date1.setUTCHours(0,0,0,0);

         custoMes += el.D2_CUSTO1;
         totalSalesMes += el.D2_TOTAL;

         if( date.getDate() ==  date1.getDate()){
            custoDia += el.D2_CUSTO1;
            totalSalesDia += el.D2_TOTAL
         }
      });

      devolutions.forEach((el)=>{
         const date = new Date(el.D1_DTDIGIT);
         const date1 = new Date()
         date1.setUTCHours(0,0,0,0);

         totalDevolutionMes += el.D1_TOTAL;
         
         if( date.getDate() ==  date1.getDate()){
            totalDevolutionDia += el.D1_TOTAL
         }
      });

      margemDia = (totalSalesDia- custoDia)/totalSalesDia * 100;
      margemMes = (totalSalesMes- custoMes)/totalSalesMes * 100;

      return{
         SD2:sales,
         SD1:devolutions,
         MES: {
            MARGEM_MES:margemMes,
            SD1_TOTAL:totalDevolutionMes,
            SD2_TOTAL:totalSalesMes - totalDevolutionMes
         },
         DIA:{
            MARGEM_DIA:margemDia,
            SD1_TOTAL:totalDevolutionDia,
            SD2_TOTAL:totalSalesDia,
            SD2_LIQUIDO: totalSalesDia - totalDevolutionDia
         }
      }
   }

   async getOrderItem(filial:string,order:string){
      if(!filial || !order)return;
      try {
         const data:SC6[] = await model.getSC6(order,filial);
         return data;
      } catch (error) {
         return 402;
      }
      
   }

}
