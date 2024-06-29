import { useState, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import { FaLink } from 'react-icons/fa'
import {
  filter,
  get,
  isEmpty,
  isObject,
  keyBy, size, times
} from 'lodash-es'
import useGetCategoryList from '../../../hooks/useGetCategoryList'
import useCategoryInfo from '../../../hooks/useCategoryInfo'
import Drawer from '../../../components/Drawer'
import PurchaseModal from '../../../components/Modal/Purchase'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import SearchMenu from '../../../components/SearchMenu'
import useSearchMenuAction from '../../../components/SearchMenu/useSearchMenuAction'
import { PHASE_TYPE } from '../../../components/SearchMenu/constants'

const ItemSelectSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading } = useGetCategoryList()
  const defaultType = searchParams.get('type') || 'all'
  const options = get(data, 'category_list', [])

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
        value={defaultType}
        disabled={isLoading}
      >
        <option value={-1} disabled>Select type</option>
        <option value='all'>All</option>
        {options.map((option) => {
          const { category, subcategory } = option
          return (
            <optgroup key={category} label={category}>
              {subcategory.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
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

const getTableLinkCols = (rowData) => {
  const {
    image_link,
    video_link
  } = rowData
  const isImageEmpty = isEmpty(image_link)
  const isVideoEmpty = isEmpty(video_link)

  const onLinkClick = (e) => {
    e.stopPropagation()
  }

  return (
    <>
      <td>
        <a
          className={clx(
            'btn btn-sm !w-20',
            { 'btn-disabled pointer-events-none': isImageEmpty }
          )}
          href={image_link}
          target='_blank'
          rel='noreferrer'
          onClick={onLinkClick}
        >
          <FaLink
            className={clx({
              '!fill-indigo-500': !isImageEmpty
            })}
          />
          Link
        </a>
      </td>
      <td>
        <a
          className={clx(
            'btn btn-sm !w-20',
            { 'btn-disabled pointer-events-none': isVideoEmpty }
          )}
          href={video_link}
          target='_blank'
          rel='noreferrer'
          onClick={onLinkClick}
        >
          <FaLink
            className={clx({
              '!fill-indigo-500': !isVideoEmpty
            })}
          />
          Link
        </a>
      </td>
    </>
  )
}

const getTableCols = (rowData) => {
  const tableLinkCols = getTableLinkCols(rowData)
  if (isEmpty(rowData)) {
    return (
      <>
        {times(11).map((index) => (
          <td key={index}>
            <p className='skeleton h-4 w-16' />
          </td>
        ))}
        {tableLinkCols}
      </>
    )
  }

  const {
    fish_name,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    note
  } = rowData
  return (
    <>
      <td>{fish_name}</td>
      <td>{fish_size}</td>
      <td>{unit_price}</td>
      <td>{retail_price}</td>
      <td>{inventory}</td>
      <td>{min_purchase_quantity}</td>
      <td>{note}</td>
      <td>特殊要求</td>
      <td>購買數量</td>
      {tableLinkCols}
    </>
  )
}

const PurchaseTable = (props) => {
  const {
    selectProductMap, onClickRow, phase, phaseType
  } = props
  const [searchParams] = useSearchParams()
  const category = searchParams.get('type') || 'all'
  const { data, isLoading } = useCategoryInfo(category === 'all' ? '' : category)
  const tableData = useMemo(() => {
    return filter(
      isLoading ? times(30) : get(data, 'items', times(30)),
      (rowData) => {
        if (isLoading || (phaseType !== PHASE_TYPE.NORMAL)) {
          return true
        }
        const { fish_name, science_name, note } = rowData
        return [fish_name, science_name, note].some((item) => item.includes(phase))
      }
    )
  }, [isLoading, data, phase, phaseType])

  return (
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
          <td>圖片連結</td>
          <td>影片連結</td>
        </tr>
      </thead>
      <tbody>
        {tableData.map((rowData, index) => {
          const isSelected = rowData.fish_code in selectProductMap
          return (
            <tr
              key={index}
              className={clx(
                'whitespace-nowrap cursor-pointer',
                { 'bg-base-200': isSelected }
              )}
              onClick={() => isObject(rowData) && onClickRow(rowData)}
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
                    <TiShoppingCart size='1.5em' className='!fill-indigo-500' />
                  </span>
                  {index + 1}
                </label>
              </th>
              {getTableCols(rowData)}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const PurchaseModalTable = (props) => {
  const { rowData } = props
  const {
    fish_name,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    note
  } = rowData
  return (
    <div className='m-4 rounded-box border border-base-200'>
      <table className='table table-sm'>
        <tbody>
          <tr>
            <td>品名</td>
            <td>{fish_name}</td>
          </tr>
          <tr>
            <td>尺寸</td>
            <td>{fish_size}</td>
          </tr>
          <tr>
            <td>單價</td>
            <td>{unit_price}</td>
          </tr>
          <tr>
            <td>建議零售價</td>
            <td>{retail_price}</td>
          </tr>
          <tr>
            <td>在庫量</td>
            <td>{inventory}</td>
          </tr>
          <tr>
            <td>起購量</td>
            <td>{min_purchase_quantity}</td>
          </tr>
          <tr>
            <td>說明</td>
            <td>{note}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const PurchaseDomestic = () => {
  const modalRef = useRef()
  const modalOkCallback = useRef()
  const [clickRowData, setClickRowData] = useState({})
  const [selectProducts, setSelectProducts] = useState([])
  const searchMenuAction = useSearchMenuAction()
  const selectProductMap = keyBy(selectProducts, 'fish_code')
  const { phase, phaseType } = searchMenuAction

  const onRemoveRow = (rowData) => {
    const { fish_code } = rowData
    const newSelectProducts = selectProducts.filter((selectProduct) => {
      return selectProduct.fish_code !== fish_code
    })
    setSelectProducts(newSelectProducts)
    setClickRowData({})
  }

  const onSelectRow = (rowData) => {
    setSelectProducts([...selectProducts, rowData])
  }

  const onClickRow = (rowData) => {
    const { fish_code } = rowData
    setClickRowData(rowData)
    modalRef.current.open()
    const isSelected = fish_code in selectProductMap
    if (isSelected) {
      modalOkCallback.current = () => onRemoveRow(rowData)
      return
    }
    modalOkCallback.current = () => onSelectRow(rowData)
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
          點擊
          <TiShoppingCart size='1.5em' className='!fill-indigo-500' />
          加入購物車
          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
          從購物車移除
        </p>
        <div className='overflow-x-auto max-sm:h-[calc(100dvh-14.5rem)] sm:h-[calc(100dvh-11.5rem)]'>
          <PurchaseTable
            selectProductMap={selectProductMap}
            onClickRow={onClickRow}
            phase={phase}
            phaseType={phaseType}
          />
        </div>
      </div>
      <PurchaseModal
        modalRef={modalRef}
        onOk={onPurchaseModalOk}
        onClose={onPurchaseModalClose}
        isAddToCert={!(clickRowData.fish_code in selectProductMap)}
      >
        <PurchaseModalTable
          rowData={clickRowData}
        />
      </PurchaseModal>
    </Drawer>
  )
}

export default PurchaseDomestic
