import { useState, useRef } from 'react'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import {
  keyBy, size
} from 'lodash-es'
import Drawer from '../../../components/Drawer'
import PurchaseModal from '../../../components/Modal/Purchase'
import SearchMenu from '../../../components/SearchMenu'
import useSearchMenuAction from '../../../components/SearchMenu/useSearchMenuAction'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import ItemSelectSection from './ItemSelectSection'
import PurchaseTable from './PurchaseTable'
import PurchaseModalTable from './PurchaseModalTable'

const PurchaseExport = () => {
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
          Click
          <TiShoppingCart size='1.5em' className='!fill-indigo-500' />
          add to cart
          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
          remove from cart
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

export default PurchaseExport
