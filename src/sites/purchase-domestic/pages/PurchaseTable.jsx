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
import {
  TiShoppingCart,
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown
} from 'react-icons/ti'
import {
  get,
  isEmpty,
  isObject,
  size,
  times
} from 'lodash-es'
import { atom, useAtom } from 'jotai'
import { useIntersectionObserver } from '@react-hooks-library/core'
import useCategoryInfo from '../../../hooks/useCategoryInfo'
import ViewFileModal from './ViewFileModal'
import wait from '../../../utils/wait'
import { usePhase } from '../../../components/SearchMenu/store'

const sortFieldAtom = atom()
const sortOrderAtom = atom()
const pageSizeAtom = atom(0)

const getTableLinkCols = (rowData, isSelected, onClick) => {
  const {
    fish_code,
    image_links,
    video_links
  } = rowData
  const isImageEmpty = isEmpty(image_links)
  const isVideoEmpty = isEmpty(video_links)
  const isAssetExist = !(isVideoEmpty && isImageEmpty)

  const handleViewFileBtnClick = (e) => {
    e.stopPropagation()
    onClick(rowData)
  }

  return (
    <td data-desktop>
      <button
        type='button'
        id={`view-file-btn-${fish_code}`}
        className={clx(
          'btn btn-sm !w-20',
          {
            'btn-disabled pointer-events-none': !isAssetExist,
            'btn-outline btn-primary': isSelected
          }
        )}
        onClick={handleViewFileBtnClick}
      >
        <FaEye
          className={clx({
            '!fill-indigo-500': isAssetExist
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
  const rowData = {
    ...data,
    ...get(selectProductMap, data.fish_code, data)
  }
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
        'whitespace-nowrap cursor-pointer max-md:[&_[data-desktop]]:hidden',
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
        <td
          key={i}
          className={clx('table-cell', {
            'max-md:hidden': i > 2
          })}
        >
          <p className='skeleton h-4 w-16' />
        </td>
      ))}
      {isRowVisible && (
        <>
          <td>{fish_name}</td>
          <td>{fish_size}</td>
          <td>{unit_price}</td>
          <td data-desktop>{retail_price}</td>
          <td data-desktop>{inventory === -1 ? '無上限' : inventory}</td>
          <td data-desktop>{min_purchase_quantity}</td>
          <td data-desktop>{note}</td>
          <td data-desktop>{request}</td>
          <td data-desktop>{quantity}</td>
          {tableLinkCols}
        </>
      )}
    </tr>
  )
}

const PAGE_SIZE = 100

const PageTableRows = (props) => {
  const {
    page,
    onClickRow,
    selectProductMap,
    onViewFileModalClick,
    stopLoadmore
  } = props
  const [sortField] = useAtom(sortFieldAtom)
  const [sortOrder] = useAtom(sortOrderAtom)
  const [phase] = usePhase()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('type') || 'all'
  const uuid = searchParams.get('uuid')
  const queryPayload = useMemo(() => {
    const commonPayload = {
      page,
      uuid,
      search_keyword: phase,
      sort_field: sortField,
      sort_order: sortOrder
    }
    if (category === 'all') {
      return commonPayload
    }

    return { ...commonPayload, category }
  }, [page, category, phase, uuid, sortField, sortOrder])
  const {
    data, isLoading
  } = useCategoryInfo(queryPayload, {
    onSuccess: (result) => {
      const tableData = get(result, 'results.items', [])
      if (size(tableData) === PAGE_SIZE) {
        return
      }
      stopLoadmore()
    }
  })
  const totalTableData = useMemo(() => {
    if (
      isLoading && (isEmpty(data) || page === 0)
    ) {
      return times(PAGE_SIZE)
    }

    const tableData = get(data, 'items', [])
    return tableData
  }, [isLoading, data, page])

  return totalTableData.map((rowData, index) => {
    return (
      <TableRow
        key={index}
        index={index + (page * PAGE_SIZE)}
        rowData={rowData}
        onClickRow={onClickRow}
        selectProductMap={selectProductMap}
        onViewFileModalClick={onViewFileModalClick}
      />
    )
  })
}

const SortCell = (props) => {
  const {
    field,
    children
  } = props
  const [sortField, setSortField] = useAtom(sortFieldAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const [, setPageSize] = useAtom(pageSizeAtom)

  const renderSortIcon = () => {
    if (sortField !== field) {
      return <TiArrowUnsorted />
    }

    if (sortOrder === 'asc') {
      return <TiArrowSortedDown />
    }

    if (sortOrder === 'desc') {
      return <TiArrowSortedUp />
    }

    return <TiArrowUnsorted />
  }

  const onSortChange = async () => {
    setPageSize(0)
    await wait(0)

    if (sortField !== field) {
      setSortField(field)
      setSortOrder('asc')
      return
    }

    if (sortOrder === 'asc') {
      setSortOrder('desc')
      return
    }

    setSortOrder(null)
    setSortField(null)
  }

  return (
    <button
      type='button'
      className='flex w-full cursor-pointer select-none items-center gap-1'
      onClick={onSortChange}
    >
      <span>{children}</span>
      {renderSortIcon()}
    </button>
  )
}

const PurchaseTable = (props) => {
  const {
    selectProductMap, onClickRow
  } = props
  const [sortField] = useAtom(sortFieldAtom)
  const [sortOrder] = useAtom(sortOrderAtom)
  const [pageSize, setPageSize] = useAtom(pageSizeAtom)
  const [phase] = usePhase()
  const modalRef = useRef()
  const tableRef = useRef()
  const loadmoreRef = useRef()
  const isAllowLoadmoreRef = useRef(true)
  const [selectedRow, setSelectedRow] = useState({})
  const [isAllDataVisible, setIsAllDataVisible] = useState(false)
  const { inView } = useIntersectionObserver(loadmoreRef)
  const pages = useMemo(() => {
    return times(pageSize)
  }, [pageSize])

  const onViewFileModalClick = (row) => {
    modalRef.current.open()
    setSelectedRow(row)
  }

  const stopLoadmore = () => {
    setIsAllDataVisible(true)
    isAllowLoadmoreRef.current = false
  }

  useEffect(() => {
    const loadmore = async () => {
      if (!inView || !isAllowLoadmoreRef.current) {
        return
      }

      isAllowLoadmoreRef.current = false
      setPageSize(pageSize + 1)
      await wait(300)
      isAllowLoadmoreRef.current = true
    }
    loadmore()
  }, [inView, pageSize, setPageSize])

  useEffect(() => {
    tableRef.current.scrollIntoView()
    isAllowLoadmoreRef.current = true
    setPageSize(0)
    setIsAllDataVisible(false)
  }, [phase, setIsAllDataVisible, setPageSize, sortField, sortOrder])

  return (
    <>
      <table
        ref={tableRef}
        className='table table-pin-rows table-pin-cols'
      >
        <thead>
          <tr className='z-[1] max-sm:-top-1 max-md:[&_[data-desktop]]:hidden'>
            <th>項次</th>
            <td>
              <SortCell field='fish_name'>
                品名
              </SortCell>
            </td>
            <td>
              <SortCell field='fish_size'>
                尺寸
              </SortCell>
            </td>
            <td>
              <SortCell field='unit_price'>
                單價
              </SortCell>
            </td>
            <td data-desktop>建議零售價</td>
            <td data-desktop>在庫量</td>
            <td data-desktop>起購量</td>
            <td data-desktop>說明</td>
            <td data-desktop>特殊要求</td>
            <td data-desktop>購買數量</td>
            <td data-desktop>檢視連結</td>
          </tr>
        </thead>
        <tbody className='content-visibility-auto'>
          {pages.map((page) => {
            return (
              <PageTableRows
                key={page}
                page={page}
                onClickRow={onClickRow}
                selectProductMap={selectProductMap}
                stopLoadmore={stopLoadmore}
                onViewFileModalClick={onViewFileModalClick}
              />
            )
          })}
        </tbody>
      </table>
      <div
        ref={loadmoreRef}
        className={clx(
          'flex h-16 w-full justify-center',
          { hidden: isAllDataVisible }
        )}
      >
        <span className='loading loading-spinner loading-md' />
      </div>
      <ViewFileModal
        id='view-file-modal'
        modalRef={modalRef}
        selectedRow={selectedRow}
      />
    </>
  )
}

export default PurchaseTable
