import Menu from "@/components/Menu/Menu";
import useUser from "@/hook/useUser";
import Head from 'next/head'
import style from  '../sass/Dashboard.module.scss'
import Content from "@/components/Contents/Content";
import { AllProvider } from "@/context/allContext";
import { InitialProvider } from "@/context/initialInfoContext";
import { ToastProvider } from "@/context/toastContext";
const Dashboard = ()=>{
   useUser();
   return(
      <>
         <Head>
            <title>Dashboard</title>
            <meta name="description" content="Dashbord vendas" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="favIcon.ico" />
         </Head>
         <main className={style.main_content}>
            <AllProvider>
               <Menu/>
               <ToastProvider>
                  <InitialProvider>
                     <Content/>
                  </InitialProvider>
               </ToastProvider>
             
            </AllProvider>
         </main>
      </>
   )
}
export default Dashboard;