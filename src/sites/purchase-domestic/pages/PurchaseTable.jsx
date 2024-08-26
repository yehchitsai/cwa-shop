import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import clx from 'classnames'
import { MdOutlineDelete } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
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
import ViewFileModal from './ViewFileModal'

const getTableLinkCols = (rowData, isSelected, onClick) => {
  const {
    image_link,
    video_link
  } = rowData
  const isImageEmpty = isEmpty(image_link)
  const isVideoEmpty = isEmpty(video_link)

  const handleViewFileBtnClick = (e) => {
    e.stopPropagation()
    onClick(rowData)
  }

  return (
    <td>
      <button
        type='button'
        className={clx(
          'btn btn-sm !w-20',
          {
            'btn-disabled pointer-events-none': isVideoEmpty || isImageEmpty,
            'btn-outline btn-primary': isSelected
          }
        )}
        onClick={handleViewFileBtnClick}
      >
        <FaEye
          className={clx({
            '!fill-indigo-500': !isImageEmpty
          })}
        />
        檢視
      </button>
    </td>
  )
}

const getTableCols = (rowData, isSelected, onClick) => {
  const tableLinkCols = getTableLinkCols(rowData, isSelected, onClick)
  if (isEmpty(rowData)) {
    return (
      <>
        {times(9).map((index) => (
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
    note,
    quantity = 0,
    request = ''
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
      <td>{request}</td>
      <td>{quantity}</td>
      {tableLinkCols}
    </>
  )
}

const PurchaseTable = (props) => {
  const {
    selectProductMap, onClickRow, phase, phaseType
  } = props
  const modalRef = useRef()
  const [selectedRow, setSelectedRow] = useState({})
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

  const onViewFileModalClick = (row) => {
    modalRef.current.open()
    setSelectedRow(row)
  }

  return (
    <>
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
            <td>檢視連結</td>
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData, index) => {
            const selectRowData = get(selectProductMap, rowData.fish_code, rowData)
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
                {getTableCols(selectRowData, isSelected, onViewFileModalClick)}
              </tr>
            )
          })}
        </tbody>
      </table>
      <ViewFileModal
        id='view-file-modal'
        modalRef={modalRef}
        selectedRow={selectedRow}
      />
    </>
  )
}

export default PurchaseTable
