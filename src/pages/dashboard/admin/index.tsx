import Menu from '@/components/Menu/Menu'
import style from '../../../sass/Dashboard.module.scss'
import useUser from '@/hook/useUser'
import { useEffect } from 'react'
import { useUserContext } from '@/context/userContext'
import { useRouter } from 'next/router'
import AdminContents from '@/components/AdminContents/AdminContents'
import { ToastProvider } from '@/context/toastContext'
export default function Admin() {
  useUser()
  return (
    <ToastProvider>
      <main className={style.main_content}>
        <Menu />
        <AdminContents />
      </main>
    </ToastProvider>
  )
}
