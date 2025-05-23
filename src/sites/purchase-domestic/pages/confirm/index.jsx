import { useState } from 'react'
import { Formik, Field, Form } from 'formik'
import {
  filter, get, isEqual, map, pick
} from 'lodash-es'
import clx from 'classnames'
import safeAwait from 'safe-await'
import toast from 'react-hot-toast'
import { MdOutlineDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CountSelect from '../CountSelect'
import usePrepurchaseOrder from '../../../../hooks/usePrepurchaseOrder'
import useCreateConfirmOrder from '../../../../hooks/useCreateConfirmOrder'
import useCreatePrepurchaseOrder from '../../../../hooks/useCreatePrepurchaseOrder'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

const Confirm = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const { data = initCart } = usePrepurchaseOrder({
    onSuccess: (result) => {
      console.log(result)
      setItems(get(result, 'results.items', []))
    },
    onError: console.log
  })
  const {
    trigger: createPrepurchaseOrder,
    isMutating: isPreorderMutating
  } = useCreatePrepurchaseOrder()
  const {
    trigger: createConfirmOrder,
    isMutating: isOrderMutating
  } = useCreateConfirmOrder()
  const navigate = useNavigate()
  const {
    total_price
  } = data
  const isLoading = (isPreorderMutating || isOrderMutating)

  const updateCart = async (newItems) => {
    const orderItems = map(newItems, (item) => {
      return pick(item, ['fish_code', 'quantity', 'request'])
    })
    const body = { order_items: orderItems }
    const result = await safeAwait(createPrepurchaseOrder(body))
    return result
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
    toast.success('刪除訂單成功! 3 秒後返回首頁', { id: toastId })
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  return (
    <Formik
      initialValues={items}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formHelper) => {
        const formItems = get(formHelper, 'values', [])
        return (
          <Form>
            <div
              className='m-auto h-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
            >
              {/* <div className='h-[calc(100dvh-5.5rem)] overflow-x-auto'> */}
              <div className='h-[calc(100dvh-8.5rem)] overflow-x-auto'>
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
                  <tbody>
                    {map(items, (item, index) => {
                      const {
                        fish_name,
                        fish_size,
                        unit_price,
                        min_purchase_quantity
                      } = item
                      const itemTotal = get(formItems, `${index}.quantity`, 0)
                      return (
                        <tr
                          key={index}
                          className={clx(
                            'whitespace-nowrap cursor-pointer'
                          )}
                        >
                          <th className='text-sm'>
                            {index + 1}
                          </th>
                          <td>{fish_name}</td>
                          <td>{fish_size}</td>
                          <td>{unit_price}</td>
                          <td>
                            <CountSelect
                              max={min_purchase_quantity}
                              name={`${index}.quantity`}
                              disabled={isLoading}
                            />
                          </td>
                          <td>
                            <Field
                              className='input input-sm input-bordered w-40'
                              name={`${index}.request`}
                              disabled={isLoading}
                            />
                          </td>
                          <td>{itemTotal * unit_price}</td>
                          <th className='text-right'>
                            <button
                              type='button'
                              className='btn btn-square btn-outline btn-error'
                              onClick={() => onRemove(formHelper, index)}
                              disabled={isLoading}
                            >
                              <MdOutlineDelete
                                size='1.5em'
                              />
                            </button>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className='my-2 mr-4 flex justify-end space-x-2'>
                <div className='mr-4 flex items-center justify-center break-all'>
                  總金額：
                  <br />
                  {`${total_price} NTD`}
                </div>
                <div>
                  <button
                    type='submit'
                    className='btn btn-outline btn-success'
                    disabled={isLoading}
                  >
                    {`${t('submitCart')}`}
                  </button>
                </div>
                <div>
                  <button
                    type='button'
                    className='btn btn-outline btn-error'
                    onClick={onRemoveAll}
                    disabled={isLoading}
                  >
                    {`${t('removerAll')}`}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Confirm
