import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import { MdShoppingCart, MdSearch, MdOutlineDelete } from 'react-icons/md'
import { GiClick } from 'react-icons/gi'
import { keyBy, size, times } from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'
import CartItems from '../../../components/CartItems'
import Drawer from '../../../components/Drawer'

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
          'select select-bordered w-full'
        )}
        onChange={onSelectType}
        defaultValue={defaultType}
      >
        <option value={-1} disabled>Select type</option>
        {types.map((type) => {
          const { label, value } = type
          return (
            <option value={value} key={value}>
              {label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const PurchaseDomestic = () => {
  const [selectProducts, setSelectProducts] = useState([])
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
    const isSelected = id in selectProductMap
    if (isSelected) {
      onRemoveRow(id)
      return
    }
    onSelectRow(id)
  }

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CartItems items={selectProducts} />
      )}
      bottomItems={(
        <CartBottomItems items={selectProducts} />
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      indicator={size(selectProducts)}
      overlay
    >
      <div className='space-y-4 p-4'>
        <div className='grid grid-flow-col gap-4'>
          <div className='grid-cols-1'>
            <ItemSelectSection />
          </div>
          <div className='grid-cols-1'>
            <label className='input input-bordered flex items-center'>
              <input type='text' className='grow' placeholder='Search' autoComplete='off' />
              <MdSearch size='1.5em' />
            </label>
          </div>
        </div>
        <p className='flex gap-2'>
          <GiClick size='1.5em' className='!fill-indigo-500' />
          加入購物車
          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
          從購物車移除
        </p>
        <div className='h-[calc(100dvh-12.5rem)] overflow-x-auto'>
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
    </Drawer>
  )
}

export default PurchaseDomestic
