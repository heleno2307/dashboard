import { useState } from 'react'
import { FiBarChart } from 'react-icons/fi'
import { ImSpinner8 } from 'react-icons/im'
import {
  MdArrowForwardIos,
  MdAttachMoney,
  MdCompareArrows,
} from 'react-icons/md'

import Devolution from '../Devolution/Devoltion'
import Popup from '../Popup/Popup'
import style from './DayInfo.module.scss'

interface Props {
  initial: {
    MARGEM_DIA: number
    SD1_TOTAL: number
    SD2_TOTAL: number
    SD2_LIQUIDO: number
  } | null
  seller?: string
}

const DayInfo = ({ initial, seller }: Props) => {
  const [popup, setPopup] = useState(false)

  return (
    <div className={style.main_info}>
      {initial != null ? (
        <div className={style.infos}>
          <div className={style.info}>
            <p className={style.title}>
              Valor vendido{' '}
              <span>
                <MdArrowForwardIos className={style.dayInfo_iconArrow} />
              </span>{' '}
            </p>
            <p className={style.value}>
              {initial?.SD2_TOTAL
                ? initial.SD2_TOTAL.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : '0,00'}
            </p>
          </div>
          <div className={style.divIcon}>
            <MdAttachMoney className={`${style.dayInfo_icon} ${style.sale}`} />
          </div>
        </div>
      ) : (
        <div className={style.infos}>
          <ImSpinner8 className={style.icon_spin} />
        </div>
      )}
      {initial != null ? (
        <div className={style.infos}>
          <div className={style.info}>
            <p className={style.title}>
              Valor liquido{' '}
              <span>
                <MdArrowForwardIos className={style.dayInfo_iconArrow} />
              </span>{' '}
            </p>
            <p className={style.value}>
              {initial?.SD2_LIQUIDO
                ? initial.SD2_LIQUIDO.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : '0,00'}
            </p>
          </div>
          <div className={style.divIcon}>
            <MdAttachMoney className={`${style.dayInfo_icon} ${style.sale}`} />
          </div>
        </div>
      ) : (
        <div className={style.infos}>
          <ImSpinner8 className={style.icon_spin} />
        </div>
      )}
      {initial != null ? (
        <div className={style.infos}>
          <div className={style.info}>
            <p className={style.title}>
              Margem{' '}
              <span>
                <MdArrowForwardIos className={style.dayInfo_iconArrow} />
              </span>
            </p>
            <p className={style.value}>
              {initial?.MARGEM_DIA ? initial.MARGEM_DIA.toFixed(2) : '0'}%
            </p>
          </div>
          <div className={style.divIcon}>
            <FiBarChart
              className={`${style.dayInfo_icon} ${style.margin_sale}`}
            />
          </div>
        </div>
      ) : (
        <div className={style.infos}>
          <ImSpinner8 className={style.icon_spin} />
        </div>
      )}
      {initial != null ? (
        <div
          className={`${style.infos} ${style.devolutionDiv}`}
          onClick={() => setPopup(true)}
        >
          <div className={style.info}>
            <p className={style.title}>
              Devolução{' '}
              <span>
                <MdArrowForwardIos className={style.dayInfo_iconArrow} />
              </span>
            </p>
            <p className={style.value}>
              {initial?.SD1_TOTAL
                ? initial.SD1_TOTAL.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : 'R$ 0,00'}
            </p>
          </div>
          <div className={style.divIcon}>
            <MdCompareArrows
              className={`${style.dayInfo_icon}  ${style.devolution}`}
            />
          </div>
        </div>
      ) : (
        <div className={style.infos}>
          <ImSpinner8 className={style.icon_spin} />
        </div>
      )}
      <Popup width={1000} state={popup} setState={setPopup}>
        <Devolution seller={seller} />
      </Popup>
    </div>
  )
}

export default DayInfo
