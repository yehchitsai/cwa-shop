import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import { MdShoppingCart, MdSearch } from 'react-icons/md'
import { GiClick } from 'react-icons/gi'
import { size, times } from 'lodash-es'
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
  const selectProducts = []
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
        <p className='flex gap-2 text-indigo-500'>
          <GiClick size='1.5em' className='!fill-indigo-500' />
          點擊列加入購物車
        </p>
        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th>項次</th>
                <th>品名</th>
                <th>尺寸</th>
                <th>單價</th>
                <th>建議零售價</th>
                <th>在庫量</th>
                <th>起購量</th>
                <th>說明</th>
                <th>特殊要求</th>
                <th>購買數量</th>
                <th>金額</th>
                <th>圖片連結</th>
                <th>影片連結</th>
              </tr>
            </thead>
            <tbody>
              {times(50, (index) => {
                return (
                  <tr
                    key={index}
                    className={clx(
                      'whitespace-nowrap',
                      { 'bg-gray-500 text-white': index % 5 === 0 }
                    )}
                  >
                    <td className='text-center'>{index + 1}</td>
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
