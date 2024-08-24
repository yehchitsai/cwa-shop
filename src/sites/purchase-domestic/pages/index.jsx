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

const PurchaseDomestic = () => {
  const modalRef = useRef()
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
    modalRef.current.open()
    const isSelected = fish_code in selectProductMap
    if (isSelected) {
      modalOkCallback.current = () => onRemoveRow(rowData)
      return
    }
    modalOkCallback.current = () => onSelectRow(rowData)
  }

  // const onPurchaseModalOk = () => modalOkCallback.current()

  const onPurchaseModalOk = (formValues) => {
    modalRef.current.close()
    if (isAddToCart) {
      onSelectRow(formValues)
      return
    }
    onRemoveRow(formValues)
  }

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
      <Formik
        initialValues={clickRowData}
        // validationSchema={validationSchema}
        onSubmit={onPurchaseModalOk}
      >
        <PurchaseModal
          modalRef={modalRef}
          onClose={onPurchaseModalClose}
          isAddToCart={isAddToCart}
        >
          {(footer) => {
            return (
              <Form>
                <PurchaseModalTable
                  isAddToCart={isAddToCart}
                  rowData={clickRowData}
                />
                {footer}
              </Form>
            )
          }}
        </PurchaseModal>
      </Formik>
    </Drawer>
  )
}

export default PurchaseDomestic
