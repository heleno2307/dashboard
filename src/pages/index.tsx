import Login from '@/components/Login/Login'
import { ToastProvider } from '@/context/toastContext'
import Head from 'next/head'



export default function Home() {
 
  return (
    <>
      <Head>
        <title>Rocha Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favIcon.ico" />
      </Head>
      <ToastProvider>
        <Login/>
      </ToastProvider>
      
    </>
  )
}

