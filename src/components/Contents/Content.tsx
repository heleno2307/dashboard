import React, { useEffect, useState } from 'react';
import DayInfo from '../DayInfo/DayInfo';
import style from './Content.module.scss';
import Name from '../Name.tsx/Name';
import MainInfo from '../MainInfo/MainInfo';
import { IoMdRefresh } from 'react-icons/io';
import { InitialProvider } from '@/context/initialInfoContext';
import { ToastProvider } from '@/context/toastContext';
import { useAllContext } from '@/context/allContext';
import Toggle from '../Toggle/Toggle';

const Content = () => {
  const [refresh, setRefresh] = useState(true);
  const {all} = useAllContext();
  const [toggle,setToggle] = useState(false);
  //RENDERIZA NOVAMENTE OS COMPONENTES
  const handleRefresh = () => {
    setRefresh(false);

    // Após um curto período, define novamente como true para forçar a re-renderização
    setTimeout(() => {
      setRefresh(true);
    }, 50);
  };

  useEffect(() => {
  }, [refresh,all]);



  return (
    <>
      <ToastProvider>
        {refresh && (
          <InitialProvider>
            <section className={style.content}>
              <div className={style.header}>
                <Name />
                <IoMdRefresh onClick={handleRefresh} className={style.icon}/>
                <Toggle handleRefresh={handleRefresh} toggle={toggle} setToggle={setToggle}/>
                
              </div> 
                <DayInfo />
                <MainInfo />
            </section>
          </InitialProvider>
        )}
      </ToastProvider>
   
    </>
  );
};

export default Content;
