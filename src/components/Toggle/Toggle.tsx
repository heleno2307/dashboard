import { Dispatch, FC, SetStateAction, useState } from 'react'
import style from './Toggle.module.scss'
import { useAllContext } from '@/context/allContext'

interface Prop {
  handleRefresh: () => void
  setToggle: Dispatch<SetStateAction<boolean>>
  toggle: boolean
  text: string
  setText: Dispatch<SetStateAction<string>>
}
const Toggle: FC<Prop> = ({
  handleRefresh,
  setToggle,
  toggle,
  setText,
  text,
}) => {
  const { alterAll } = useAllContext()

  const AnimatedToggle = () => {
    setToggle(!toggle)
    if (text == 'User') {
      setText('Todos')
      alterAll()
    } else {
      setText('User')
      alterAll()
    }
    setTimeout(handleRefresh, 700)
  }
  return (
    <div className={style.conteiner} onClick={AnimatedToggle}>
      <div className={`${style.toggle} ${toggle ? style.active : null}`}>
        <div className={style.toggleB}></div>
      </div>
      <div className={`${style.text} ${toggle ? style.active : null}`}>
        {text}
      </div>
    </div>
  )
}
export default Toggle
