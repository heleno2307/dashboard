import { ReactNode, createContext, useContext, useState } from 'react'
type ToastContextType = {
  showToast: (toast: string, message: string, time: number) => void
  toastErro: boolean
  toastInfo: boolean
  toastSucsses: boolean
  message: string
}
const toastContext = createContext<ToastContextType | null>(null)

type Props = {
  children: ReactNode
}

const ToastProvider = ({ children }: Props) => {
  const [toastInfo, setToastInfo] = useState<boolean>(false)
  const [toastErro, setToastErro] = useState<boolean>(false)
  const [toastSucsses, setToastSucsses] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const showToast = (toast: string, message: string, time: number) => {
    if (toast == 'sucsses') {
      setToastSucsses(true)
      setMessage(message)
      setTimeout(() => setToastSucsses(false), time)
    } else if (toast == 'info') {
      setToastInfo(true)
      setMessage(message)
      setTimeout(() => setToastInfo(false), time)
    } else if (toast == 'erro') {
      setToastErro(true)
      setMessage(message)
      setTimeout(() => setToastErro(false), time)
    }
  }

  return (
    <toastContext.Provider
      value={{ showToast, toastErro, toastInfo, toastSucsses, message }}
    >
      {children}
    </toastContext.Provider>
  )
}

const useToast = () => {
  const context = useContext(toastContext)
  if (!context) {
    throw new Error('useTalks must be used within a TalksProvider')
  }
  return context
}

export { ToastProvider, useToast }
