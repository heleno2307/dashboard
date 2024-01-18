export default function limitarCaracteres(texto:string, limite:number) {
   // Verifica se o comprimento da string é menor ou igual ao limite
   if (texto.length <= limite) {
       return texto;
   } else {
       // Se for maior, retorna os primeiros 'limite' caracteres da string
       return texto.substring(0, limite);
   }
}
