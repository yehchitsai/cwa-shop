import { useMemo, useState, useRef } from 'react'
import { Formik, Form } from 'formik'
import {
  filter, flow, get, isEmpty, isEqual, isObject, keyBy, map, pick,
  sumBy,
  times
} from 'lodash-es'
import clx from 'classnames'
import safeAwait from 'safe-await'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdEdit, MdDiscount } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import usePrepurchaseOrder from '../../../../hooks/usePrepurchaseOrder'
import useCreateConfirmOrder from '../../../../hooks/useCreateConfirmOrder'
import useCreatePrepurchaseOrder from '../../../../hooks/useCreatePrepurchaseOrder'
import useCategoryInfo from '../../../../hooks/useCategoryInfo'
import Modal from '../../../../components/Modal'
import { FORM_ITEM } from '../constants'
import EditRowModal from '../EditRowModal'
import toSafeNumber from '../../../../utils/numberUtils'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

const mockItems = times(20).map(() => ({ quantity: 0, request: '' }))

const getTotalPrice = (result) => {
  const totalPrice = get(result, 'results.total_price', 0)
  return totalPrice
}

const getDiscounts = (result) => {
  const discounts = get(result, 'results.discounts', [])
  return discounts
}

const defaultClickRowData = {
  [FORM_ITEM.QUANTITY]: 0,
  [FORM_ITEM.REQUEST]: ''
}

const Confirm = () => {
  const { t } = useTranslation()
  const purchaseModalRef = useRef()
  const modifyPurchaseModalRef = useRef()
  const [clickRowData, setClickRowData] = useState(defaultClickRowData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [discounts, setDiscounts] = useState([])
  const [items, setItems] = useState(mockItems)
  const { data = initCart } = usePrepurchaseOrder({
    onSuccess: (result) => {
      const newTotalPrice = getTotalPrice(result)
      const newDiscounts = getDiscounts(result)
      setTotalPrice(newTotalPrice)
      setDiscounts(newDiscounts)
    },
    onError: console.log
  })
  const fishCodes = useMemo(() => {
    return get(data, 'items', []).map((item) => item.fish_code).join(',')
  }, [data])
  const {
    isLoading: isCategoryInfoLoading
  } = useCategoryInfo(isEmpty(fishCodes) ? null : { fish_code: fishCodes }, {
    onSuccess: (result) => {
      const categoryInfoMap = flow(
        () => get(result, 'results.items', []),
        (categoryInfoItems) => keyBy(categoryInfoItems, 'fish_code')
      )()
      const newItems = get(data, 'items', []).map((item, index) => {
        const { fish_code } = item
        return {
          index,
          ...item,
          fish_code,
          min_purchase_quantity: get(categoryInfoMap, `${fish_code}.min_purchase_quantity`, 0),
          inventory: get(categoryInfoMap, `${fish_code}.inventory`, 0)
        }
      })
      setItems(newItems)
    }
  })
  const {
    trigger: createPrepurchaseOrder,
    isMutating: isPreorderMutating
  } = useCreatePrepurchaseOrder({
    onSuccess: (result) => {
      const newTotalPrice = getTotalPrice(result)
      const newDiscounts = getDiscounts(result)
      setTotalPrice(newTotalPrice)
      setDiscounts(newDiscounts)
    }
  })
  const {
    trigger: createConfirmOrder,
    isMutating: isOrderMutating
  } = useCreateConfirmOrder()
  const navigate = useNavigate()
  const { totalDiscount, isDiscountEmpty } = useMemo(() => {
    const newIsDiscountEmpty = isEmpty(discounts)
    const newTotalDiscount = sumBy(discounts, (discount) => +get(discount, 'discount_amt', 0))
    return {
      totalDiscount: newTotalDiscount,
      isDiscountEmpty: newIsDiscountEmpty
    }
  }, [discounts])
  const isLoading = (isPreorderMutating || isOrderMutating || isCategoryInfoLoading)
  const isDisabled = (isLoading || isSubmitted)

  // Coerce totalPrice and totalDiscount to safe numbers to prevent NaN rendering
  const displayTotalPrice = toSafeNumber(totalPrice)
  const displayTotalDiscount = toSafeNumber(totalDiscount)

  const updateCart = async (newItems) => {
    const orderItems = map(newItems, (item) => {
      return pick(item, ['fish_code', 'quantity', 'request'])
    })
    const body = { order_items: orderItems }
    const result = await safeAwait(createPrepurchaseOrder(body))
    return result
  }

  const onClickRow = (originData) => {
    if (isDisabled) {
      return
    }

    const rowData = {
      [FORM_ITEM.MIN_PURCHASE_QUANTITY]: get(originData, FORM_ITEM.MIN_PURCHASE_QUANTITY, 0),
      [FORM_ITEM.REQUEST]: get(originData, FORM_ITEM.REQUEST, ''),
      ...originData
    }
    setClickRowData(rowData)
    modifyPurchaseModalRef.current.open()
  }

  const onEditModalClose = () => {
    purchaseModalRef.current.close()
    setClickRowData(defaultClickRowData)
  }

  const onEditModalOk = (newRowData) => {
    const newItems = items.map((item) => {
      if (newRowData.fish_code === item.fish_code) {
        return { ...item, ...newRowData }
      }

      return item
    })
    const isUpdateSuccess = updateCart(newItems)
    if (!isUpdateSuccess) {
      return
    }

    setItems(newItems)
    onEditModalClose()
  }

  const onRemove = async (formHelper, index) => {
    const toastId = toast.loading('更新訂單...')
    const newItems = filter(formHelper.values, (item, itemIndex) => {
      return index !== itemIndex
    })
    const [createPrepurchaseOrderError] = await updateCart(newItems)
    if (createPrepurchaseOrderError) {
      toast.error(`更新訂單失敗! ${createPrepurchaseOrderError.message}`, { id: toastId })
      return
    }

    setItems(newItems)
    toast.success('更新訂單成功!', { id: toastId })
  }

  const onSubmit = async (formValues) => {
    const isFormChanged = !isEqual(formValues, items)
    const toastId = toast.loading('送出訂單...')
    if (isFormChanged) {
      const [createPrepurchaseOrderError] = await updateCart(formValues)
      if (createPrepurchaseOrderError) {
        toast.error(`更新訂單失敗! ${createPrepurchaseOrderError.message}`, { id: toastId })
        return
      }
    }

    const [createConfirmOrderError] = await safeAwait(createConfirmOrder())
    if (createConfirmOrderError) {
      toast.error(`送出訂單失敗! ${createConfirmOrderError.message}`, { id: toastId })
      return
    }

    toast.success('送出訂單成功! 3 秒後返回首頁', { id: toastId })
    setIsSubmitted(true)
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  const onRemoveAll = async () => {
    const toastId = toast.loading('刪除訂單...')
    const [createPrepurchaseOrderError] = await updateCart([])
    if (createPrepurchaseOrderError) {
      toast.error(`刪除訂單失敗! ${createPrepurchaseOrderError.message}`, { id: toastId })
      return
    }

    setItems([])
    setDiscounts([])
    toast.success('刪除訂單成功! 3 秒後返回首頁', { id: toastId })
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  const onModifyPurchaseModalClose = (formHelper) => () => {
    modifyPurchaseModalRef.current.close()
    onRemove(formHelper, clickRowData.index)
  }

  const onModifyPurchaseModalOk = () => {
    purchaseModalRef.current.open()
  }

  return (
    <>
      <Formik
        initialValues={items}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formHelper) => {
          return (
            <>
              <Form>
                <div
                  className='m-auto h-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
                >
                  <div className='flex h-[calc(100dvh-8.5rem)] flex-col justify-between'>
                    <div
                      className={clx('max-h-[50dvh] overflow-x-auto overscroll-x-none', {
                        'h-[calc(100dvh-8.5rem)]': isDiscountEmpty
                      })}
                    >
                      <table className='table table-pin-rows table-pin-cols'>
                        <thead>
                          <tr className='max-sm:-top-1'>
                            <th>項次</th>
                            <td>品名</td>
                            <td>尺寸</td>
                            <td>單價</td>
                            <td className='min-w-32'>購買數量</td>
                            <td>特殊要求</td>
                            <td>金額</td>
                            <th />
                          </tr>
                        </thead>
                        <tbody
                          className={clx({
                            '[&_p]:skeleton [&_p]:text-transparent': isLoading
                          })}
                        >
                          {map(items, (item, index) => {
                            const {
                              [FORM_ITEM.FISH_NAME]: fish_name = '--',
                              [FORM_ITEM.FISH_SIZE]: fish_size = '--',
                              [FORM_ITEM.UNIT_PRICE]: unit_price = 0,
                              [FORM_ITEM.REQUEST]: request = '--',
                              [FORM_ITEM.QUANTITY]: quantity = 0
                            } = item
                            return (
                              <tr
                                key={index}
                                className={clx(
                                  'whitespace-nowrap cursor-pointer'
                                )}
                                onClick={() => isObject(item) && onClickRow(item)}
                              >
                                <th className='text-sm'>
                                  <p>
                                    {index + 1}
                                  </p>
                                </th>
                                <td>
                                  <p>{fish_name}</p>
                                </td>
                                <td>
                                  <p>{fish_size}</p>
                                </td>
                                <td>
                                  <p>{unit_price}</p>
                                </td>
                                <td>
                                  <p>{quantity}</p>
                                </td>
                                <td>
                                  <p>{request}</p>
                                </td>
                                <td>
                                  <p>{quantity * unit_price}</p>
                                </td>
                                <th>
                                  <MdEdit size='1.2em' />
                                </th>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className={clx({ hidden: isDiscountEmpty })}>
                      <div className='divider my-1' />
                      <div className='flex items-center gap-2 px-2 text-lg font-bold'>
                        <MdDiscount />
                        <span>折扣</span>
                      </div>
                      <div className='max-h-[calc(44dvh-8.5rem)] overflow-x-auto'>
                        <table className='table table-pin-rows max-w-full'>
                          <thead>
                            <tr className='max-sm:-top-1'>
                              <th>項次</th>
                              <th>名稱</th>
                              <td>金額</td>
                            </tr>
                          </thead>
                          <tbody
                            className={clx({
                              '[&_p]:skeleton [&_p]:text-transparent': isLoading
                            })}
                          >
                            {map(discounts, (discount, index) => {
                              const {
                                type = '--',
                                discount_amt = 0
                              } = discount
                              const safeDiscountAmt = toSafeNumber(discount_amt)
                              return (
                                <tr
                                  key={index}
                                  className='whitespace-nowrap'
                                >
                                  <th className='text-sm'>
                                    <p>
                                      {index + 1}
                                    </p>
                                  </th>
                                  <td>
                                    <p>{type}</p>
                                  </td>
                                  <td>
                                    <p>{`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeDiscountAmt)} NTD`}</p>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className='m-2 flex justify-between'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex break-all text-sm'>
                        總折扣：
                        <br />
                        <span className={clx({ 'skeleton text-transparent': isLoading })}>
                          {`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(displayTotalDiscount)} NTD`}
                        </span>
                      </div>
                      <div className='flex break-all text-sm'>
                        總金額：
                        <br />
                        <span className={clx({ 'skeleton text-transparent': isLoading })}>
                          {`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(displayTotalPrice)} NTD`}
                        </span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div>
                        <button
                          type='submit'
                          className='btn btn-outline btn-success'
                          disabled={isDisabled}
                        >
                          {`${t('submitCart')}`}
                        </button>
                      </div>
                      <div>
                        <button
                          type='button'
                          className='btn btn-outline btn-error'
                          onClick={onRemoveAll}
                          disabled={isDisabled}
                        >
                          {`${t('removerAll')}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              <Modal
                id='MODIFY_PURCHASE_MODAL'
                title='修改或從購物車刪除'
                modalRef={modifyPurchaseModalRef}
                onClose={onModifyPurchaseModalClose(formHelper)}
                onOk={onModifyPurchaseModalOk}
                closeText='刪除'
                okText='修改'
              />
            </>
          )
        }}
      </Formik>
      <EditRowModal
        modalRef={purchaseModalRef}
        onSubmit={onEditModalOk}
        onClose={onEditModalClose}
        initialValues={clickRowData}
        isLoading={isLoading}
        isAddToCart={false}
      />
    </>
  )
}

export default Confirm
