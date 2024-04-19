import style from './Menu.module.scss'
import { IoMdHome } from 'react-icons/io'
import { ImBubbles2 } from 'react-icons/im'
import { BsFileText } from 'react-icons/bs'
import { FaWhatsapp } from 'react-icons/fa6'
import { CiLogout } from 'react-icons/ci'
import { useState } from 'react'
import { useUserContext } from '@/context/userContext'
import Link from 'next/link'
import { FiBarChart } from 'react-icons/fi'
import { useRouter } from 'next/router'
const Menu = () => {
  const { logOut, user } = useUserContext()
  const router = useRouter()
  const [rota, setRota] = useState(router.asPath)

  const [colors, setColors] = useState({
    home: rota === '/Dashboard',
    mktzap: false,
    bubble: false,
    whatsApp: false,
    admin: rota === '/dashboard/admin',
  })

  /*
      essa função altera a cor da borda dos icones no menu, de acordo com
      o icone clicado pelo o usuário
   */
  const chengeColor = (name: string) => {
    if (name == 'mktzap') {
      if (!colors.mktzap) {
        setColors({
          bubble: false,
          home: false,
          mktzap: true,
          whatsApp: false,
          admin: false,
        })
      }
    } else if (name == 'whatsApp') {
      if (!colors.whatsApp) {
        setColors({
          bubble: false,
          home: false,
          mktzap: false,
          whatsApp: true,
          admin: false,
        })
      }
    } else if (name == 'bubble') {
      if (!colors.bubble) {
        setColors({
          bubble: true,
          home: false,
          mktzap: false,
          whatsApp: false,
          admin: false,
        })
      }
    } else if (name == 'home') {
      if (!colors.home) {
        setColors({
          bubble: false,
          home: true,
          mktzap: false,
          whatsApp: false,
          admin: false,
        })
      }
    } else if (name == 'admin') {
      if (!colors.admin) {
        setColors({
          bubble: false,
          home: false,
          mktzap: false,
          whatsApp: false,
          admin: true,
        })
      }
    }
  }

  return (
    <nav className={style.menu}>
      <div className={style.top}>
        <div
          className={`${style.div_icon} ${colors.home ? style.active : null}`}
          onClick={() => chengeColor('home')}
        >
          <Link href={'/Dashboard'} className={style.link}>
            <IoMdHome className={style.menu_icon} />
          </Link>
        </div>
        <div
          className={`${style.div_icon} ${colors.mktzap ? style.active : null}`}
          onClick={() => chengeColor('mktzap')}
        >
          <Link
            href={'https://app.mktzap.com.br/login'}
            target="_blank"
            className={style.link}
          >
            <ImBubbles2 className={style.menu_icon} />
          </Link>
        </div>
        <div
          className={`${style.div_icon} ${colors.bubble ? style.active : null}`}
          onClick={() => chengeColor('bubble')}
        >
          <Link
            href={'https://sendfirst.bubbleapps.io/'}
            target="_blank"
            className={style.link}
          >
            <BsFileText className={style.menu_icon} />
          </Link>
        </div>
        <div
          className={`${style.div_icon} ${colors.whatsApp ? style.active : null}`}
          onClick={() => chengeColor('whatsApp')}
        >
          <Link
            href={'https://web.whatsapp.com/'}
            target="_blank"
            className={style.link}
          >
            <FaWhatsapp className={style.menu_icon} />
          </Link>
        </div>
        {user?.admin && (
          <div
            className={`${style.div_icon} ${colors.admin ? style.active : null}`}
            onClick={() => chengeColor('admin')}
          >
            <Link href={'/dashboard/admin'} className={style.link}>
              <FiBarChart className={style.menu_icon} />
            </Link>
          </div>
        )}
      </div>
      <div className={style.bottom} onClick={logOut}>
        <CiLogout className={style.menu_icon} />
      </div>
    </nav>
  )
}

export default Menu
