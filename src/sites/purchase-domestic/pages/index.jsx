import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { GiClick } from 'react-icons/gi'
import {
  keyBy, size, times
} from 'lodash-es'
import Drawer from '../../../components/Drawer'
import PurchaseModal from '../../../components/Modal/Purchase'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import SearchMenu from '../../../components/SearchMenu'
import useSearchMenuAction from '../../../components/SearchMenu/useSearchMenuAction'

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

const PurchaseDomestic = () => {
  const modalRef = useRef()
  const modalOkCallback = useRef()
  const [clickRowId, setClickRowId] = useState(null)
  const [selectProducts, setSelectProducts] = useState([])
  const searchMenuAction = useSearchMenuAction()
  const selectProductMap = keyBy(selectProducts, 'id')

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
            <SearchMenu
              name='search'
              searchMenuAction={searchMenuAction}
            />
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
