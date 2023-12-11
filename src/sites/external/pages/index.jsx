import {
  Suspense,
  useMemo,
  useState
} from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { MdShoppingCart } from 'react-icons/md'
import toast from 'react-hot-toast'
import {
  find, flow, get, isEmpty, keyBy, map, reduce, size
} from 'lodash-es'
import safeAwait from 'safe-await'
import clx from 'classnames'
import {
  selectedProductsState
} from '../../../state/selectedProducts'
import useFishTypes from '../../../hooks/useFishTypes'
import useFishData from '../../../hooks/useFishData'
import useCreate from '../../../hooks/useCreate'
import useOnInit from '../../../hooks/useOnInit'
import getApiHost from '../../../utils/getApiHost'
import Card from '../../../components/Card'
import ProductModel from '../../../components/Model/Product'
import SkeletonHome from '../../../components/Skeleton/Home'
import Drawer from '../../../components/Drawer'
import CartItems from '../../../components/CartItems'
import CartBottomItems from '../../../components/CartBottomItems'

const productModelKey = 'productModel'

const preOrderHost = getApiHost('VITE_AWS_FISH_PREORDER')
const preOrderEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/bettafishpreorder`

const SelectSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { i18n } = useTranslation()
  const {
    fishTypes
  } = useFishTypes(i18n.language)
  const fishType = useMemo(
    () => searchParams.get('fishType') || get(fishTypes, '0.value'),
    [searchParams, fishTypes]
  )

  const onSelectType = (e) => {
    const newFishType = e.target.value
    setSearchParams({ fishType: newFishType })
  }

  return (
    <div className='w-full p-4'>
      <select
        className={clx(
          'select select-bordered w-full'
        )}
        onChange={onSelectType}
        defaultValue={fishType}
      >
        <option value={-1} disabled>Select fish type</option>
        {fishTypes.map((type) => {
          const { label, value } = type
          return (
            <option value={value} key={value}>
              {label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const CardsSection = (props) => {
  const {
    setIsProductModalOpen,
    setTargetProduct
  } = props
  const [searchParams] = useSearchParams()
  const { i18n } = useTranslation()
  const { fishTypes } = useFishTypes(i18n.language)
  const {
    trigger: reserveByItemSerial,
    isMutating: isReserving
  } = useCreate(preOrderHost)
  const fishType = useMemo(
    () => searchParams.get('fishType') || get(fishTypes, '0.value'),
    [searchParams, fishTypes]
  )
  const {
    data: fishData
  } = useFishData(fishType)
  const [reservedMap, setReservedMap] = useState({})
  const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState)
  const defaultSelectedProducts = useLoaderData()

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct({ ...newTargetProduct, fishType })
    setIsProductModalOpen(true)
    document.querySelector(`#${productModelKey}`).showModal()
  }

  const onSelectProduct = (product) => async (e) => {
    const toastId = toast.loading('Updating...')
    const isSelected = e.target.checked
    const targetItemSerial = product.itemSerial
    let newSelectProducts = [...selectedProducts]
    let newRemoveProducts = []
    if (isSelected) {
      newSelectProducts = [...selectedProducts, { ...product, fishType }]
    } else {
      const { add, remove } = reduce(selectedProducts, (collect, selectProduct) => {
        const isAdd = (selectProduct.itemSerial !== targetItemSerial)
        if (isAdd) {
          collect.add.push(selectProduct)
        } else {
          collect.remove.push(selectProduct)
        }
        return collect
      }, { add: [], remove: [] })
      newSelectProducts = add
      newRemoveProducts = remove
    }
    const reserveItemSerials = map(newSelectProducts, 'itemSerial')
    const clearItemSerials = map(newRemoveProducts, 'itemSerial')
    const [reserveError, reserveData] = await safeAwait(reserveByItemSerial({
      url: preOrderEndPoint,
      fishType,
      reserveItemSerials,
      clearItemSerials
    }))
    if (reserveError) {
      setSelectedProducts(selectedProducts)
      toast.error(`Error! No.${targetItemSerial} ${reserveError.message}`, { id: toastId })
      return false
    }

    const {
      done,
      reason = 'unknow update status'
    } = flow(
      () => get(reserveData, 'results'),
      (results) => find(results, { itemSerial: targetItemSerial }) || {}
    )()
    const isSuccess = (done === 1)
    const statusToast = isSuccess ? toast.success : toast.error
    if (done === 0) {
      newSelectProducts = newSelectProducts.filter((newSelectProduct) => {
        return newSelectProduct.itemSerial !== targetItemSerial
      })
      setReservedMap({ ...reservedMap, [targetItemSerial]: targetItemSerial })
    }
    setSelectedProducts(newSelectProducts)
    statusToast(`No.${targetItemSerial} ${reason}`, { id: toastId })
    return isSuccess ? isEmpty(clearItemSerials) : false
  }

  useOnInit(() => {
    setSelectedProducts(defaultSelectedProducts)
  })

  const defaultSelectProductMap = keyBy(defaultSelectedProducts, 'itemSerial')
  return fishData.map((item) => {
    const { itemSerial } = item
    const defaultIsSelect = (itemSerial in defaultSelectProductMap)
    return (
      <Card
        key={itemSerial}
        item={item}
        onImageClick={openProductModal(item)}
        onSelectProduct={onSelectProduct}
        defaultIsSelect={defaultIsSelect}
        isReserving={isReserving || (itemSerial in reservedMap)}
      />
    )
  })
}

const Home = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState({})
  const [selectProducts] = useRecoilState(selectedProductsState)

  const closeProductModal = () => setIsProductModalOpen(false)

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CartItems items={selectProducts} />
      )}
      bottomItems={(
        <CartBottomItems items={selectProducts} />
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      indicator={size(selectProducts)}
      overlay
    >
      <div
        className={clx(
          'm-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl max-sm:p-4 sm:p-12'
        )}
      >
        <div className='flex flex-wrap'>
          <Suspense fallback={<SkeletonHome />}>
            <SelectSection />
          </Suspense>
        </div>
        <div className='flex flex-wrap'>
          <Suspense fallback={<SkeletonHome className='h-[70vh]' />}>
            <CardsSection
              setIsProductModalOpen={setIsProductModalOpen}
              setTargetProduct={setTargetProduct}
            />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<SkeletonHome />}>
        <ProductModel
          id={productModelKey}
          visible={isProductModalOpen}
          onClose={closeProductModal}
          product={targetProduct}
        />
      </Suspense>
    </Drawer>
  )
}

export default Home
