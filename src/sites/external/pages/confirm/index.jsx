import { Suspense, useState, useRef } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { MdDelete } from 'react-icons/md'
import {
  Await, useLoaderData, useNavigate, useAsyncValue
} from 'react-router-dom'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import {
  flow, get, size, sumBy, groupBy, reduce, map, find, set, isEmpty, round
} from 'lodash-es'
import { selectedProductsState } from '../../../../state/selectedProducts'
import { orderDataState } from '../../../../state/orderData'
import getEnvVar from '../../../../utils/getEnvVar'
import getApiPrefix from '../../../../utils/getApiPrefix'
import useFishTypes from '../../../../hooks/useFishTypes'
import useOnInit from '../../../../hooks/useOnInit'
import useCreate from '../../../../hooks/useCreate'
import SkeletonHome from '../../../../components/Skeleton/Home'
import LazyImage from '../../../../components/LazyImage'
import ProductModal from '../../../../components/Modal/Product'

const preOrderHost = getEnvVar('VITE_AWS_FISH_PREORDER_SHOP_HOST')
const orderHost = getEnvVar('VITE_AWS_FISH_ORDER_SHOP_HOST')
const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const preOrderEndPoint = `${awsHostPrefix}/bettafishpreorder`
const orderEndPoint = `${awsHostPrefix}/fishorder`

const productModalKey = 'productModal'

const Page = () => {
  const modalRef = useRef()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const { fishTypeMap, isLoading } = useFishTypes(i18n.language)
  const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState)
  const setOrderData = useSetRecoilState(orderDataState)
  const [targetProduct, setTargetProduct] = useState({})
  const defaultSelectedProducts = useAsyncValue()
  const { trigger: reserveByItemSerial, isMutating: isReserving } = useCreate(preOrderHost)
  const { trigger: orderByItemSerial, isMutating: isOrdering } = useCreate(orderHost)
  const { currency, data: selectedTypes } = flow(
    () => groupBy(selectedProducts, (selectedProduct) => selectedProduct.fishType),
    (groupedProducts) => reduce(groupedProducts, (collect, products, fishType) => {
      if (isEmpty(collect.currency)) {
        set(collect, 'currency', get(fishTypeMap, `${fishType}.currency`, ''))
      }
      collect.data.push({
        fishName: get(fishTypeMap, `${fishType}.fishName`),
        count: size(products)
      })
      return collect
    }, { data: [], currency: '' })
  )()
  const totalPrice = flow(
    () => sumBy(selectedProducts, (selectedProduct) => {
      return +(get(fishTypeMap, `${selectedProduct.fishType}.fishPrice`))
    }),
    (summaryPrice) => round(summaryPrice, 2)
  )()

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct(newTargetProduct)
    modalRef.current.open()
  }

  const onRemove = (product) => async () => {
    const toastId = toast.loading('Updating...')
    const targetItemSerial = get(product, 'itemSerial')
    const { add, remove } = selectedProducts.reduce((collect, selectedProduct) => {
      const isRemoveTarget = selectedProduct.itemSerial === targetItemSerial
      if (isRemoveTarget) {
        collect.remove.push(selectedProduct)
      } else {
        collect.add.push(selectedProduct)
      }
      return collect
    }, { add: [], remove: [] })
    const reserveItemSerials = map(add, 'itemSerial')
    const clearItemSerials = map(remove, 'itemSerial')
    const fishType = get(remove, '0.fishType')
    const [reserveError, reserveData] = await safeAwait(reserveByItemSerial({
      url: preOrderEndPoint,
      body: {
        fishType,
        reserveItemSerials,
        clearItemSerials
      }
    }))
    if (reserveError) {
      toast.error(`Error! No.${targetItemSerial} ${reserveError.message}`, { id: toastId })
      return
    }

    setSelectedProducts(add)
    const { reason = 'unknow update status' } = flow(
      () => get(reserveData, 'results'),
      (results) => find(results, { itemSerial: targetItemSerial }) || {}
    )()
    if (!isEmpty(reserveItemSerials)) {
      toast.success(`No.${targetItemSerial} ${reason}`, { id: toastId })
      return
    }

    toast.success('All items removed,\nback to products page in 3sec', { id: toastId })
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  const onRemoveAll = async () => {
    const toastId = toast.loading('Updating...')
    const fishType = get(selectedProducts, '0.fishType')
    const clearItemSerials = map(selectedProducts, 'itemSerial')
    if (!isEmpty(clearItemSerials)) {
      const [reserveError] = await safeAwait(reserveByItemSerial({
        url: preOrderEndPoint,
        body: {
          fishType,
          reserveItemSerials: [],
          clearItemSerials
        }
      }))
      if (reserveError) {
        toast.error(`Error! ${reserveError.message}`, { id: toastId })
        return
      }
    }

    setSelectedProducts([])
    toast.success('All items removed,\nback to products page in 3sec', { id: toastId })
    setTimeout(() => navigate('../', { relative: 'path' }), 3000)
  }

  const onOrder = async () => {
    const toastId = toast.loading('Ordering...')
    const orderItems = map(selectedProducts, 'itemSerial')
    const [orderError, orderData] = await safeAwait(orderByItemSerial({
      url: orderEndPoint,
      body: {
        orderItems
      }
    }))
    if (orderError) {
      toast.error(`Error! ${orderError.message}`, { id: toastId })
      return
    }

    toast.success('Order complete!', { id: toastId })
    setOrderData(get(orderData, 'results', {}))
    navigate('../complete', { relative: 'path' })
  }

  useOnInit(() => {
    if (isEmpty(selectedProducts)) {
      setSelectedProducts(defaultSelectedProducts)
    }
  })

  if (isLoading) {
    return (
      <SkeletonHome />
    )
  }

  const isUpdating = (isReserving || isOrdering)
  return (
    <>
      <div
        className='m-auto h-auto overflow-x-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
      >
        <table className='table table-pin-cols'>
          <thead>
            <tr>
              <th />
              <th className='z-[1]'>{`${t('pictures')}`}</th>
              <th>{`${t('fishType')}`}</th>
              <th>{`${t('tankNo')}`}</th>
              <th>{`${t('itemPrice')}`}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((selectedProduct, index) => {
              const {
                imageURL, itemSerial, fishType
              } = selectedProduct
              const { fishName, fishPrice } = get(fishTypeMap, fishType, {})
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <th>
                    <div className='size-20'>
                      <LazyImage
                        src={imageURL}
                        className='mask mask-square m-0 size-20 cursor-pointer'
                        alt={fishName}
                        loaderClassName='mask mask-square w-20 h-20'
                        onClick={openProductModal(selectedProduct)}
                      />
                    </div>
                  </th>
                  <td>{fishName}</td>
                  <td>{itemSerial}</td>
                  <td>{`${fishPrice} ${currency}`}</td>
                  <th>
                    <button
                      type='button'
                      className='btn btn-square btn-outline btn-error'
                      onClick={onRemove(selectedProduct)}
                      disabled={isUpdating}
                    >
                      <MdDelete size='1.5em' />
                    </button>
                  </th>
                </tr>
              )
            })}
          </tbody>
          <thead>
            <tr>
              <th colSpan={2} className='z-10'>{`${t('totalSelected')}`}</th>
              <th colSpan={2}>{`${t('orderList')}`}</th>
              <th>{`${t('totalPrice')}`}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>{`${size(selectedProducts)}`}</th>
              <td colSpan={2}>
                {selectedTypes.map(({ fishName, count }, index) => (
                  <p key={index}>{`${fishName} x ${count}`}</p>
                ))}
              </td>
              <td>
                {`${totalPrice} ${currency}`}
              </td>
              <th className='space-y-2'>
                <button
                  type='button'
                  className='btn btn-outline btn-success'
                  disabled={isUpdating}
                  onClick={onOrder}
                >
                  {`${t('submitCart')}`}
                </button>
                <br />
                <button
                  type='button'
                  className='btn btn-outline btn-error'
                  onClick={onRemoveAll}
                  disabled={isUpdating}
                >
                  {`${t('removerAll')}`}
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <ProductModal
        modalRef={modalRef}
        id={productModalKey}
        product={targetProduct}
        fishTypeMap={fishTypeMap}
      />
    </>
  )
}

const Confirm = () => {
  const data = useLoaderData()
  return (
    <Suspense fallback={<SkeletonHome className='fixed top-0' />}>
      <Await
        resolve={data.selectedFishData}
        errorElement={<p>Get data failed</p>}
      >
        <Page />
      </Await>
    </Suspense>
  )
}

export default Confirm
