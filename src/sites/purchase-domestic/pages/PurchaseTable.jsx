import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import { MdOutlineDelete } from 'react-icons/md'
import { FaLink } from 'react-icons/fa'
import { TiShoppingCart } from 'react-icons/ti'
import {
  filter,
  get,
  isEmpty,
  isObject,
  times
} from 'lodash-es'
import useCategoryInfo from '../../../hooks/useCategoryInfo'
import { PHASE_TYPE } from '../../../components/SearchMenu/constants'

const getTableLinkCols = (rowData, isSelected) => {
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
            {
              'btn-disabled pointer-events-none': isImageEmpty,
              'btn-outline btn-primary': isSelected
            }
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
            {
              'btn-disabled pointer-events-none': isVideoEmpty,
              'btn-outline btn-primary': isSelected
            }
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

const getTableCols = (rowData, isSelected) => {
  const tableLinkCols = getTableLinkCols(rowData, isSelected)
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
              {getTableCols(rowData, isSelected)}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default PurchaseTable
