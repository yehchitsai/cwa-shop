import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import {
  MdShoppingCart, MdOutlineDelete
} from 'react-icons/md'
import { TiShoppingCart } from 'react-icons/ti'
import {
  get,
  isEmpty,
  isNull,
  keyBy, map, pick
} from 'lodash-es'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import Drawer from '../../../components/Drawer'
import SearchMenu from '../../../components/SearchMenu'
import CustomCartItems from './CustomCartItems'
import CustomCartBottomItems from './CustomCartBottomItems'
import ItemSelectSection from './ItemSelectSection'
import PurchaseTable from './PurchaseTable'
import Modal from '../../../components/Modal'
import wait from '../../../utils/wait'
import useCreatePrepurchaseOrder from '../../../hooks/useCreatePrepurchaseOrder'
import usePrepurchaseOrder from '../../../hooks/usePrepurchaseOrder'
import Chat from './Chat'
import EditRowModal from './EditRowModal'
import { FORM_ITEM } from './constants'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

const defaultClickRowData = {
  [FORM_ITEM.QUANTITY]: 0,
  [FORM_ITEM.REQUEST]: ''
}

const PurchaseDomestic = () => {
  const { t } = useTranslation()
  const purchaseModalRef = useRef()
  const modifyPurchaseModalRef = useRef()
  const [clickRowData, setClickRowData] = useState(defaultClickRowData)
  const [selectProducts, setSelectProducts] = useState([])
  const [cart, setCart] = useState(initCart)
  const { trigger, isMutating } = useCreatePrepurchaseOrder()
  usePrepurchaseOrder({
    onSuccess: (result) => {
      setCart(get(result, 'results', initCart))
      setSelectProducts(get(result, 'results.items', []))
    }
  })
  const selectProductMap = keyBy(selectProducts, 'fish_code')
  const isAddToCart = !(clickRowData.fish_code in selectProductMap)
  const isNoProductSelected = isEmpty(selectProducts)

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
      return false
    }

    const newCart = get(result, 'results', initCart)
    setCart(newCart)
    toast.success('更新購物車成功!', { id: toastId })
    return true
  }

  const onRemoveRow = (rowData) => {
    const { fish_code } = rowData
    const newSelectProducts = selectProducts.filter((selectProduct) => {
      return selectProduct.fish_code !== fish_code
    })
    const isUpdateSuccess = updateCart(newSelectProducts)
    if (!isUpdateSuccess) {
      return
    }
    setSelectProducts(newSelectProducts)
    setClickRowData(defaultClickRowData)
  }

  const onSelectRow = (rowData = {}) => {
    const { fish_code } = rowData
    const isExist = fish_code in keyBy(selectProducts, 'fish_code')
    const newSelectProducts = isExist
      ? selectProducts.map((product) => {
        if (product.fish_code === fish_code) {
          return { ...product, ...rowData }
        }

        return product
      })
      : [...selectProducts, rowData]
    setSelectProducts(newSelectProducts)
    return newSelectProducts
  }

  const onClickRow = async (originData) => {
    if (isMutating) {
      return
    }

    const rowData = {
      [FORM_ITEM.MIN_PURCHASE_QUANTITY]: get(originData, FORM_ITEM.MIN_PURCHASE_QUANTITY, 0),
      [FORM_ITEM.REQUEST]: get(originData, FORM_ITEM.REQUEST, ''),
      ...originData
    }
    const { fish_code } = rowData
    setClickRowData(rowData)
    const isSelected = fish_code in selectProductMap
    if (isSelected) {
      modifyPurchaseModalRef.current.open()
      return
    }

    await wait(0)
    purchaseModalRef.current.open()
  }

  const onPurchaseModalOk = async (formValues) => {
    const newSelectProducts = onSelectRow(formValues)
    const isUpdateSuccess = updateCart(newSelectProducts)
    if (!isUpdateSuccess) {
      return
    }
    purchaseModalRef.current.close()
  }

  const onPurchaseModalClose = () => {
    setClickRowData(defaultClickRowData)
  }

  const onModifyPurchaseModalClose = () => {
    modifyPurchaseModalRef.current.close()
    onRemoveRow(clickRowData)
  }

  const onModifyPurchaseModalOk = () => {
    purchaseModalRef.current.open()
  }

  const onCustomCartItemClick = (cartItemProps) => {
    const index = get(cartItemProps, 'index', null)
    if (isNull(index)) {
      return
    }

    const item = get(cart, `items.${index}`, {})
    onClickRow(item)
  }

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CustomCartItems
          cart={cart}
          selectProductMap={selectProductMap}
          onClick={onCustomCartItemClick}
        />
      )}
      bottomItems={(
        <CustomCartBottomItems cart={cart} />
      )}
      lastItem={(
        <Link
          to='./confirm'
          className={clx('block', { 'pointer-events-none': isNoProductSelected })}
        >
          <button
            type='button'
            className={clx(
              'btn btn-primary btn-outline btn-md w-full my-1 sticky bottom-2',
              { 'btn-disabled': isNoProductSelected }
            )}
          >
            {`${t('confirmOrder')}`}
          </button>
        </Link>
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      indicator={get(cart, 'total_quantity', '0')}
      overlay
    >
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex gap-4 max-sm:flex-col sm:flex-row'>
          <div className='flex-1'>
            <ItemSelectSection />
          </div>
          <div className='flex-1 md:flex-none md:min-w-[30%]'>
            <SearchMenu name='search' />
          </div>
        </div>
        <p className='flex gap-2 text-sm'>
          點擊
          <TiShoppingCart size='1.5em' className='!fill-indigo-500' />
          加入購物車
          <MdOutlineDelete size='1.5em' className='!fill-red-500' />
          從購物車移除
        </p>
        <div className='overflow-x-auto overscroll-x-none max-sm:h-[calc(100dvh-14.5rem)] sm:h-[calc(100dvh-11.5rem)]'>
          <PurchaseTable
            selectProductMap={selectProductMap}
            onClickRow={onClickRow}
          />
        </div>
      </div>
      <EditRowModal
        modalRef={purchaseModalRef}
        isAddToCart={isAddToCart}
        isLoading={isMutating}
        onSubmit={onPurchaseModalOk}
        onClose={onPurchaseModalClose}
        initialValues={clickRowData}
      />
      <Modal
        id='MODIFY_PURCHASE_MODAL'
        title='修改或從購物車刪除'
        modalRef={modifyPurchaseModalRef}
        onClose={onModifyPurchaseModalClose}
        onOk={onModifyPurchaseModalOk}
        closeText='刪除'
        okText='修改'
      />
      <Chat />
    </Drawer>
  )
}

export default PurchaseDomestic
