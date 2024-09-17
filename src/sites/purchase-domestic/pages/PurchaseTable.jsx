import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
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
  size,
  times
} from 'lodash-es'
import { useIntersectionObserver } from '@react-hooks-library/core'
import useCategoryInfo from '../../../hooks/useCategoryInfo'
import { PHASE_TYPE } from '../../../components/SearchMenu/constants'
import ViewFileModal from './ViewFileModal'
import wait from '../../../utils/wait'

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

const TableRow = (props) => {
  const {
    rowData: data = {},
    index,
    onClickRow,
    onViewFileModalClick,
    selectProductMap
  } = props
  const visibleRef = useRef(null)
  const rowData = get(selectProductMap, data.fish_code, data)
  const isSelected = rowData.fish_code in selectProductMap
  const tableLinkCols = getTableLinkCols(rowData, isSelected, onViewFileModalClick)
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
  const isRowVisible = !isEmpty(rowData)

  return (
    <tr
      key={index}
      ref={visibleRef}
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
      {!isRowVisible && times(9).map((i) => (
        <td key={i}>
          <p className='skeleton h-4 w-16' />
        </td>
      ))}
      {isRowVisible && (
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
        </>
      )}
      {tableLinkCols}
    </tr>
  )
}

const PAGE_SIZE = 20

const PurchaseTable = (props) => {
  const {
    selectProductMap, onClickRow, phase, phaseType
  } = props
  const modalRef = useRef()
  const loadmoreRef = useRef()
  const isAllowLoadmoreRef = useRef(true)
  const [selectedRow, setSelectedRow] = useState({})
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('type') || 'all'
  const { data, isLoading } = useCategoryInfo(category === 'all' ? '' : category)
  const [isAllDataVisible, tableData] = useMemo(() => {
    const totalTableDataSize = size(get(data, 'items', []))
    const nextTableData = filter(
      isLoading ? times(PAGE_SIZE) : get(data, 'items', times(PAGE_SIZE)),
      (rowData) => {
        if (isLoading || (phaseType !== PHASE_TYPE.NORMAL)) {
          return true
        }
        const { fish_name, science_name, note } = rowData
        return [fish_name, science_name, note].some((item = '') => item.includes(phase))
      }
    ).slice(0, page * PAGE_SIZE)
    const nextTableDataSize = size(nextTableData)
    const nextIsAllDataVisible = totalTableDataSize === nextTableDataSize
    return [nextIsAllDataVisible, nextTableData]
  }, [isLoading, data, phase, phaseType, page])
  const { inView } = useIntersectionObserver(loadmoreRef)

  const onViewFileModalClick = (row) => {
    modalRef.current.open()
    setSelectedRow(row)
  }

  useEffect(() => {
    const loadmore = async () => {
      if (!inView || !isAllowLoadmoreRef.current) {
        return
      }

      isAllowLoadmoreRef.current = false
      await wait(600)
      setPage(page + 1)
      await wait(400)
      isAllowLoadmoreRef.current = true
    }
    loadmore()
  }, [inView, page])

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
            return (
              <TableRow
                key={index}
                index={index}
                rowData={rowData}
                onClickRow={onClickRow}
                selectProductMap={selectProductMap}
                onViewFileModalClick={onViewFileModalClick}
              />
            )
          })}
        </tbody>
      </table>
      {!isAllDataVisible && (
        <div
          ref={loadmoreRef}
          className='flex h-16 w-full justify-center'
        >
          <span className='loading loading-spinner loading-md' />
        </div>
      )}
      <ViewFileModal
        id='view-file-modal'
        modalRef={modalRef}
        selectedRow={selectedRow}
      />
    </>
  )
}

export default PurchaseTable
