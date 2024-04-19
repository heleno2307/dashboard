import { GrCircleInformation, GrClose, GrCheckmark } from 'react-icons/gr'

import style from './Toast.module.scss'
import { useToast } from '@/context/toastContext'
const Toast = () => {
  const { showToast, toastErro, toastInfo, toastSucsses, message } = useToast()
  return (
    <>
      <div
        className={`${style.toast} ${style.information} ${toastInfo ? null : style.hide}`}
      >
        <GrCircleInformation
          className={`${style.iconToast} ${toastInfo ? null : style.hide}`}
        />
        <p className={`${toastInfo ? null : style.hide}`}>{message}</p>
      </div>
      <div
        className={`${style.toast}  ${style.error} ${toastErro ? null : style.hide}`}
      >
        <GrClose
          className={`${style.iconToast} ${toastErro ? null : style.hide}`}
        />
        <p className={`${toastErro ? null : style.hide}`}>{message}</p>
      </div>
      <div
        className={`${style.toast}  ${style.sucsses} ${toastSucsses ? null : style.hide}`}
      >
        <GrCheckmark
          className={`${style.iconToast} ${toastSucsses ? null : style.hide}`}
        />
        <p className={`${toastSucsses ? null : style.hide}`}>{message}</p>
      </div>
    </>
  )
}

export default Toast
