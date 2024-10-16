import { useState, useRef } from 'react'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import {
  get,
  keyBy, map, pick
} from 'lodash-es'
import { Form, Formik } from 'formik'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
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
import useCreatePrepurchaseOrder from '../../../hooks/useCreatePrepurchaseOrder'
import usePrepurchaseOrder from '../../../hooks/usePrepurchaseOrder'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

const PurchaseDomestic = () => {
  const purchaseModalRef = useRef()
  const modifyPurchaseModalRef = useRef()
  const [clickRowData, setClickRowData] = useState({})
  const [selectProducts, setSelectProducts] = useState([])
  const [cart, setCart] = useState(initCart)
  const searchMenuAction = useSearchMenuAction()
  const { trigger, isMutating } = useCreatePrepurchaseOrder()
  usePrepurchaseOrder({
    onSuccess: (result) => {
      setCart(get(result, 'results', initCart))
      setSelectProducts(get(result, 'results.items', []))
    }
  })
  const selectProductMap = keyBy(selectProducts, 'fish_code')
  const { phase, phaseType } = searchMenuAction
  const isAddToCart = !(clickRowData.fish_code in selectProductMap)

  const updateCart = async (newSelectProducts) => {
    const orderItems = map(newSelectProducts, (newSelectProduct) => {
      return pick(newSelectProduct, ['fish_code', 'quantity', 'request'])
    })
    const body = { order_items: orderItems }
    const toastId = toast.loading('更新購物車...')
    const [error, result] = await safeAwait(trigger(body))
    if (error) {
      purchaseModalRef.current.close()
      toast.error(`更新購物車失敗! ${error.message}`, { id: toastId })
      return
    }

    const newCart = get(result, 'results', initCart)
    setCart(newCart)
    toast.success('更新購物車成功!', { id: toastId })
  }

  const onRemoveRow = (rowData) => {
    const { fish_code } = rowData
    const newSelectProducts = selectProducts.filter((selectProduct) => {
      return selectProduct.fish_code !== fish_code
    })
    setSelectProducts(newSelectProducts)
    setClickRowData({})
    updateCart(newSelectProducts)
  }

  const onSelectRow = (rowData) => {
    const newSelectProducts = [...selectProducts, rowData]
    setSelectProducts(newSelectProducts)
    return newSelectProducts
  }

  const onClickRow = (originData) => {
    if (isMutating) {
      return
    }

    const rowData = {
      quantity: get(originData, 'min_purchase_quantity', 0),
      request: get(originData, 'request', ''),
      ...originData
    }
    const { fish_code } = rowData
    setClickRowData(rowData)
    const isSelected = fish_code in selectProductMap
    if (isSelected) {
      modifyPurchaseModalRef.current.open()
      return
    }
    purchaseModalRef.current.open()
  }

  const onPurchaseModalOk = async (formValues) => {
    const newSelectProducts = onSelectRow(formValues)
    updateCart(newSelectProducts)
    purchaseModalRef.current.close()
  }

  const onPurchaseModalClose = () => {
    setClickRowData({})
  }

  const onModifyPurchaseModalClose = () => {
    modifyPurchaseModalRef.current.close()
    onRemoveRow(clickRowData)
  }

  const onModifyPurchaseModalOk = () => {
    purchaseModalRef.current.open()
  }

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CustomCartItems
          cart={cart}
          selectProductMap={selectProductMap}
        />
      )}
      bottomItems={(
        <CustomCartBottomItems cart={cart} />
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      indicator={get(cart, 'total_quantity', '0')}
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
                  disabled={isMutating}
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
