import { useMemo, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import {
  filter, flow, get, isEmpty, isEqual, keyBy, map, pick,
  sum,
  times
} from 'lodash-es'
import clx from 'classnames'
import safeAwait from 'safe-await'
import toast from 'react-hot-toast'
import { MdOutlineDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import CountSelect from '../CountSelect'
import usePrepurchaseOrder from '../../../../hooks/usePrepurchaseOrder'
import useCreateConfirmOrder from '../../../../hooks/useCreateConfirmOrder'
import useCreatePrepurchaseOrder from '../../../../hooks/useCreatePrepurchaseOrder'
import useCategoryInfo from '../../../../hooks/useCategoryInfo'
import FieldError from '../../../../components/Form/FieldError'
import { FORM_ITEM } from '../constants'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

function testGrater(count) {
  const { min_purchase_quantity: min } = this.parent
  if (count == null || min == null) return true

  return count >= min
    ? true
    : this.createError({
      message: `起購量為 ${min}`
    })
}

const validationSchema = Yup.array().of(
  Yup.object().shape({
    [FORM_ITEM.MIN_PURCHASE_QUANTITY]: Yup.number().required('不可為空'),
    [FORM_ITEM.QUANTITY]: Yup.number().required('不可為空').when(FORM_ITEM.MIN_PURCHASE_QUANTITY, {
      is: () => true,
      then: (schema) => schema.test(
        'greater-than-min',
        testGrater
      )
    }),
    [FORM_ITEM.REQUEST]: Yup.string()
  })
)

const mockItems = times(20).map(() => ({ quantity: 0, request: '' }))

const Confirm = () => {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [items, setItems] = useState(mockItems)
  const { data = initCart } = usePrepurchaseOrder({
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
      const newItems = get(data, 'items', []).map((item) => {
        const { fish_code } = item
        return {
          ...item,
          fish_code,
          min_purchase_quantity: get(categoryInfoMap, `${fish_code}.min_purchase_quantity`, 0),
          inventory: get(categoryInfoMap, `${fish_code}.inventory`, 0)
        }
      })
      console.log({ newItems })
      setItems(newItems)
    }
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
  const isLoading = (isPreorderMutating || isOrderMutating || isCategoryInfoLoading)
  const isDisabled = (isLoading || isSubmitted)

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
    toast.success('刪除訂單成功! 3 秒後返回首頁', { id: toastId })
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  return (
    <Formik
      initialValues={items}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {(formHelper) => {
        const formItems = get(formHelper, 'values', [])
        const totalPrice = sum(items.map((item, index) => {
          const { unit_price = 0 } = item
          const itemTotal = get(formItems, `${index}.quantity`, 0)
          return itemTotal * unit_price
        }))
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
                  <tbody
                    className={clx({
                      '[&_*]:skeleton [&_*]:bg-transparent [&_*]:text-transparent': isLoading
                    })}
                  >
                    {map(items, (item, index) => {
                      const {
                        fish_name = '--',
                        fish_size = '--',
                        unit_price = 0
                      } = item
                      const inventory = get(formItems, `${index}.inventory`, 0)
                      const itemTotal = get(formItems, `${index}.quantity`, 0)
                      const min = get(formItems, `${index}.min_purchase_quantity`, 0)
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
                            <FieldError name={`${index}.quantity`}>
                              {inventory === -1 && (
                                <Field
                                  name={`${index}.quantity`}
                                  className='input input-sm input-bordered w-full'
                                  type='text'
                                  inputMode='numeric'
                                  placeholder='無上限'
                                  min={min}
                                  disabled={isDisabled}
                                  autoComplete='off'
                                />
                              )}
                              {inventory !== -1 && (
                                <CountSelect
                                  max={inventory}
                                  min={min}
                                  name={`${index}.quantity`}
                                  disabled={isDisabled}
                                />
                              )}
                            </FieldError>
                          </td>
                          <td>
                            <Field
                              className='input input-sm input-bordered w-40'
                              name={`${index}.request`}
                              disabled={isDisabled}
                            />
                          </td>
                          <td>{itemTotal * unit_price}</td>
                          <th className='text-right'>
                            <button
                              type='button'
                              className='btn btn-square btn-outline btn-error'
                              onClick={() => onRemove(formHelper, index)}
                              disabled={isDisabled}
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
                  {`${new Intl.NumberFormat('en-US').format(totalPrice)} NTD`}
                </div>
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
          </Form>
        )
      }}
    </Formik>
  )
}

export default Confirm
