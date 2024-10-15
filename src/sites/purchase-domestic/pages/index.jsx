import { useState, useRef } from 'react'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import {
  keyBy, size
} from 'lodash-es'
import { Form, Formik } from 'formik'
import Drawer from '../../../components/Drawer'
import PurchaseModal from '../../../components/Modal/Purchase'
import SearchMenu from '../../../components/SearchMenu'
import useSearchMenuAction from '../../../components/SearchMenu/useSearchMenuAction'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import ItemSelectSection from './ItemSelectSection'
import PurchaseTable from './PurchaseTable'
import PurchaseModalTable from './PurchaseModalTable'
import Modal from '../../../components/Modal'

const PurchaseDomestic = () => {
  const purchaseModalRef = useRef()
  const modifyPurchaseModalRef = useRef()
  const modalOkCallback = useRef()
  const [clickRowData, setClickRowData] = useState({})
  const [selectProducts, setSelectProducts] = useState([])
  const searchMenuAction = useSearchMenuAction()
  const selectProductMap = keyBy(selectProducts, 'fish_code')
  const { phase, phaseType } = searchMenuAction
  const isAddToCart = !(clickRowData.fish_code in selectProductMap)

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
    const isSelected = fish_code in selectProductMap
    if (isSelected) {
      modifyPurchaseModalRef.current.open()
      return
    }
    purchaseModalRef.current.open()
    modalOkCallback.current = () => onSelectRow(rowData)
  }

  // const onPurchaseModalOk = () => modalOkCallback.current()

  const onPurchaseModalOk = (formValues) => {
    purchaseModalRef.current.close()
    onSelectRow(formValues)
  }

  const onPurchaseModalClose = () => {
    modalOkCallback.current = null
  }

  const onModifyPurchaseModalClose = () => {
    onRemoveRow(clickRowData)
    modifyPurchaseModalRef.current.close()
  }

  const onModifyPurchaseModalOk = () => {
    purchaseModalRef.current.open()
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
      <Formik
        initialValues={clickRowData}
        // validationSchema={validationSchema}
        onSubmit={onPurchaseModalOk}
      >
        <PurchaseModal
          modalRef={purchaseModalRef}
          isAddToCart={isAddToCart}
          onClose={onPurchaseModalClose}
        >
          {(footer) => {
            return (
              <Form>
                <PurchaseModalTable
                  rowData={clickRowData}
                  isAddToCart
                />
                {footer}
              </Form>
            )
          }}
        </PurchaseModal>
      </Formik>
      <Modal
        id='MODIFY_PURCHASE_MODAL'
        title='修改或從購物車刪除'
        modalRef={modifyPurchaseModalRef}
        onClose={onModifyPurchaseModalClose}
        onOk={onModifyPurchaseModalOk}
        closeText='刪除'
        okText='修改'
      />
    </Drawer>
  )
}

export default PurchaseDomestic
