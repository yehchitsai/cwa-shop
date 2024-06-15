import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import {
  MdShoppingCart, MdSearch, MdOutlineDelete, MdFilterAlt
} from 'react-icons/md'
import { GiClick } from 'react-icons/gi'
import { IoSparklesSharp } from 'react-icons/io5'
import {
  keyBy, size, times, isEmpty
} from 'lodash-es'
import Drawer from '../../../components/Drawer'
import PurchaseModal from '../../../components/Modal/Purchase'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import wait from '../../../utils/wait'

const ItemSelectSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const types = ['AAA', 'BBB', 'CCC'].map((item) => ({ label: item, value: item }))
  const defaultType = searchParams.get('type') || types[0].value

  const onSelectType = (e) => {
    const newType = e.target.value
    setSearchParams({ type: newType })
  }

  return (
    <div className='w-full'>
      <select
        className={clx(
          'select select-sm select-bordered w-full'
        )}
        onChange={onSelectType}
        defaultValue={defaultType}
      >
        <option value={-1} disabled>Select type</option>
        <option value='all'>All</option>
        {times(5, (index) => {
          return (
            <optgroup key={index} label={`group-${index}`}>
              {types.map((type) => {
                const { label, value } = type
                return (
                  <option value={value} key={value}>
                    {label}
                  </option>
                )
              })}
            </optgroup>
          )
        })}
      </select>
    </div>
  )
}

const PHASE_TYPE = {
  AI: 'ai',
  NORMAL: 'normal'
}

const PurchaseDomestic = () => {
  const modalRef = useRef()
  const modalOkCallback = useRef()
  const [clickRowId, setClickRowId] = useState(null)
  const [selectProducts, setSelectProducts] = useState([])
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [phase, setPhase] = useState('')
  const [phaseType, setPhaseType] = useState(null)
  const selectProductMap = keyBy(selectProducts, 'id')
  const isPhaseEmpty = isEmpty(phase)

  const onRemoveRow = (id) => {
    const newSelectProducts = selectProducts.filter((selectProduct) => {
      return selectProduct.id !== id
    })
    setSelectProducts(newSelectProducts)
  }

  const onSelectRow = (id) => {
    setSelectProducts([...selectProducts, { id }])
  }

  const onClickRow = (id) => {
    setClickRowId(id)
    modalRef.current.open()
    const isSelected = id in selectProductMap
    if (isSelected) {
      modalOkCallback.current = () => onRemoveRow(id)
      return
    }
    modalOkCallback.current = () => onSelectRow(id)
  }

  const onPurchaseModalOk = () => modalOkCallback.current()

  const onPurchaseModalClose = () => {
    modalOkCallback.current = null
  }

  const onPhaseChange = (e) => {
    const newPhase = e.target.value
    setPhase(newPhase)
    if (!isEmpty(newPhase)) {
      return
    }
    setPhaseType(null)
  }

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CustomCartItems items={selectProducts} />
      )}
      bottomItems={(
        <CustomCartBottomItems items={selectProducts} />
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      indicator={size(selectProducts)}
      overlay
    >
      <div className='space-y-4 p-4'>
        <div className='flex gap-4 max-sm:flex-col sm:flex-row'>
          <div className='flex-1'>
            <ItemSelectSection />
          </div>
          <div className='flex-1'>
            <label
              className={clx(
                'input input-sm input-bordered flex items-center !outline-none',
                { 'rounded-b-none !border-b-transparent': isFilterMenuOpen }
              )}
            >
              <input
                type='text'
                className='grow'
                placeholder='Search'
                autoComplete='off'
                defaultValue={phase}
                onFocus={() => setIsFilterMenuOpen(true)}
                onBlur={() => wait(300).then(() => setIsFilterMenuOpen(false))}
                onChange={onPhaseChange}
              />
              {phaseType === PHASE_TYPE.AI && (
                <IoSparklesSharp
                  size='1.5em'
                  className='!fill-yellow-300'
                />
              )}
              {phaseType === PHASE_TYPE.NORMAL && (
                <MdFilterAlt
                  size='1.5em'
                  className='!fill-indigo-500'
                />
              )}
              {phaseType === null && (
                <MdSearch size='1.5em' />
              )}
            </label>
            <div className='relative'>
              <div
                className={clx(
                  'absolute top-0 left-0 z-10 w-full',
                  'menu w-56 rounded-b-lg bg-white border-base-content/20 border',
                  { hidden: !isFilterMenuOpen }
                )}
              >
                <ul className='menu-dropdown'>
                  <li
                    className={clx({ disabled: isPhaseEmpty })}
                    onClick={() => !isPhaseEmpty && setPhaseType(PHASE_TYPE.AI)}
                  >
                    <span
                      className={clx(
                        'break-all',
                        { active: phaseType === PHASE_TYPE.AI }
                      )}
                    >
                      <IoSparklesSharp
                        size='1.5em'
                        className='!fill-yellow-300'
                      />
                      AI 搜尋
                      {isPhaseEmpty ? '' : ` "${phase}"`}
                    </span>
                  </li>
                  <li
                    className={clx({ disabled: isPhaseEmpty })}
                    onClick={() => !isPhaseEmpty && setPhaseType(PHASE_TYPE.NORMAL)}
                  >
                    <span
                      className={clx(
                        'break-all',
                        { active: phaseType === PHASE_TYPE.NORMAL }
                      )}
                    >
                      <MdFilterAlt
                        size='1.5em'
                        className='!fill-indigo-500'
                      />
                      一般過濾
                      {isPhaseEmpty ? '' : ` "${phase}"`}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className='flex gap-2 text-sm'>
          <GiClick size='1.5em' className='!fill-indigo-500' />
          加入購物車
          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
          從購物車移除
        </p>
        <div className='overflow-x-auto max-sm:h-[calc(100dvh-14.5rem)] sm:h-[calc(100dvh-11.5rem)]'>
          <table className='table table-pin-rows table-pin-cols'>
            <thead>
              <tr className='max-sm:-top-1'>
                <th>項次</th>
                <td>品名</td>
                <td>尺寸</td>
                <td>單價</td>
                <td>建議零售價</td>
                <td>在庫量</td>
                <td>起購量</td>
                <td>說明</td>
                <td>特殊要求</td>
                <td>購買數量</td>
                <td>金額</td>
                <td>圖片連結</td>
                <td>影片連結</td>
              </tr>
            </thead>
            <tbody>
              {times(50, (index) => {
                const isSelected = index in selectProductMap
                return (
                  <tr
                    key={index}
                    className={clx(
                      'whitespace-nowrap cursor-pointer',
                      { 'bg-base-200': isSelected }
                    )}
                    onClick={() => onClickRow(index)}
                  >
                    <th className={clx({ 'bg-base-200': isSelected })}>
                      <label
                        className={clx(
                          'swap text-sm flex justify-center gap-2',
                          { 'swap-active': isSelected }
                        )}
                      >
                        <span className={clx('swap-on', { hidden: !isSelected })}>
                          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
                        </span>
                        <span className={clx('swap-off', { hidden: isSelected })}>
                          <GiClick size='1.5em' className='!fill-indigo-500' />
                        </span>
                        {index + 1}
                      </label>
                    </th>
                    <td>{`品名${index}`}</td>
                    <td>{`尺寸${index}`}</td>
                    <td>{`單價${index}`}</td>
                    <td>{`建議零售價${index}`}</td>
                    <td>{`在庫量${index}`}</td>
                    <td>{`起購量${index}`}</td>
                    <td>{`說明${index}`}</td>
                    <td>{`特殊要求${index}`}</td>
                    <td>{`購買數量${index}`}</td>
                    <td>{`金額${index}`}</td>
                    <td>{`圖片連結${index}`}</td>
                    <td>{`影片連結${index}`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <PurchaseModal
        modalRef={modalRef}
        onOk={onPurchaseModalOk}
        onClose={onPurchaseModalClose}
        isAddToCert={!(clickRowId in selectProductMap)}
      />
    </Drawer>
  )
}

export default PurchaseDomestic
