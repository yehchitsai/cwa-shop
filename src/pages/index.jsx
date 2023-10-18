import {
  Suspense,
  useMemo,
  useState
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { MdShoppingCart } from 'react-icons/md'
import {
  filter, get
} from 'lodash-es'
import clx from 'classnames'
import {
  key as selectedProductsStateKey,
  selectedProductsState
} from '../state/selectedProducts'
import useFishTypes from '../hooks/useFishTypes'
import useFishData from '../hooks/useFishData'
import Card from '../components/Card'
import ProductModel from '../components/Model/Product'
import SkeletonHome from '../components/Skeleton/Home'
import Drawer from '../components/Drawer'
import CartItems from '../components/CartItems'
import CartBottomItems from '../components/CartBottomItems'

const productModelKey = 'productModel'

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
  const fishType = useMemo(
    () => searchParams.get('fishType') || get(fishTypes, '0.value'),
    [searchParams, fishTypes]
  )
  const {
    data: fishData
  } = useFishData(fishType)
  const [selectProducts, setSelectProducts] = useRecoilState(selectedProductsState)

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct({ ...newTargetProduct, fishType })
    setIsProductModalOpen(true)
    document.querySelector(`#${productModelKey}`).showModal()
  }

  const onSelectProduct = (product) => (e) => {
    const isSelected = e.target.checked
    let newSelectProducts = [...selectProducts]
    if (isSelected) {
      newSelectProducts = [...selectProducts, { ...product, fishType }]
    } else {
      newSelectProducts = filter(selectProducts, (selectProduct) => {
        return selectProduct.itemSerial !== product.itemSerial
      })
    }
    window.localStorage.setItem(selectedProductsStateKey, JSON.stringify(newSelectProducts))
    setSelectProducts(newSelectProducts)
  }

  return fishData.map((item) => (
    <Card
      key={item.itemSerial}
      item={item}
      onImageClick={openProductModal(item)}
      onSelectProduct={onSelectProduct}
      selectProducts={selectProducts}
    />
  ))
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
        // { 'm-0 p-0 w-full overflow-y-hidden': isContentLoading }
        'm-0 p-0 w-full overflow-y-hidden'
      )}
      overlay
      // indicator={2}
      isRoot
      rwd
    >
      <div
        className={clx(
          'max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl max-sm:p-4 sm:p-12'
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
