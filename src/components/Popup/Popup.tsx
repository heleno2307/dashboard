import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import style from './Popup.module.scss';

type Props = {
   children : ReactNode;
   width: number;
   state: boolean;
   setState: Dispatch<SetStateAction<boolean>>
}

const Popup = ({children,width=500,state,setState}:Props)=>{
   const [hide,setHide]= useState(false);
   const styleWidth = {
      width: `${width}px`
   }
   const closeAction = ()=>{
      setHide(true);
      setTimeout(()=> {
         setState(false);
         setHide(false)
      },600);
   }

   if(!state){
      return null;
   }
   return(
      <>
         <div 
            className={`${style.fade} ${hide?style.hide:null}`}
            onClick={closeAction}
         ></div>
         <div 
            className={`${style.popup} ${hide?style.hide:null}`}
            style={styleWidth}
         >
            {children}
         </div>
      </>
   )
}
export default Popup;