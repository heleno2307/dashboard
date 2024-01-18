export const subtrairDias =(days:number) =>{
   const dataAtual = new Date();
   dataAtual.setDate(dataAtual.getDate() - days);
   const anoF = dataAtual.getFullYear();
   const mesF = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se for necessário
   const diaF = dataAtual.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se for necessário
   return anoF + mesF + diaF;
 }

export const somarDias = (dataString: string, dias: number): string => {
  const ano = parseInt(dataString.substring(0, 4), 10);
  const mes = parseInt(dataString.substring(4, 6), 10) - 1; // Mês começa do zero no JavaScript
  const dia = parseInt(dataString.substring(6, 8), 10);

  const dataAtual = new Date(ano, mes, dia);
  dataAtual.setDate(dataAtual.getDate() + dias);

  const anoF = dataAtual.getFullYear();
  const mesF = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
  const diaF = dataAtual.getDate().toString().padStart(2, '0');

  return `${anoF}${mesF}${diaF}`;
};

