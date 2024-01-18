export default function capitalizeNames(str:string) {
   return str.toLowerCase()
   .replace('.',' ')
   .replace(/\b\w/g, function(match:string) {
       return match.toUpperCase();
   });
}
