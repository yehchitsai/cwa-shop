import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MdShoppingCart } from 'react-icons/md'
import {
  filter, get
} from 'lodash-es'
import clx from 'classnames'
import useFishTypes from '../hooks/useFishTypes'
import useFishData from '../hooks/useFishData'
import Card from '../components/Card'
import ProductModel from '../components/Model/Product'
import SkeletonHome from '../components/Skeleton/Home'
import Drawer from '../components/Drawer'
import CartItems from '../components/CartItems'
import CartBottomItems from '../components/CartBottomItems'

const productModelKey = 'productModel'

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { i18n } = useTranslation()
  const {
    fishTypes,
    isLoading: isFishTypesLoading,
    fishTypeMap
  } = useFishTypes(i18n.language)
  const fishType = useMemo(
    () => searchParams.get('fishType') || get(fishTypes, '0.value'),
    [searchParams, fishTypes]
  )
  const { data: fishData, isLoading: isFishDataLoading } = useFishData(fishType)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState({})
  const [selectProducts, setSelectProducts] = useState([])
  if (isFishTypesLoading) {
    return <SkeletonHome />
  }

  const openProductModal = (newTargetProduct) => async () => {
    const fishTypeInfo = get(fishTypeMap, fishType, {})
    setTargetProduct({ ...newTargetProduct, ...fishTypeInfo })
    setIsProductModalOpen(true)
    document.querySelector(`#${productModelKey}`).showModal()
  }

  const closeProductModal = () => setIsProductModalOpen(false)

  const onSelectType = (e) => {
    const newFishType = e.target.value
    setSearchParams({ fishType: newFishType })
  }

  const onSelectProduct = (product) => (e) => {
    const isSelected = e.target.checked
    let newSelectProducts = [...selectProducts]
    if (isSelected) {
      const fishTypeInfo = get(fishTypeMap, fishType, {})
      newSelectProducts = [...selectProducts, { ...product, ...fishTypeInfo }]
    } else {
      newSelectProducts = filter(selectProducts, (selectProduct) => {
        return selectProduct.itemSerial !== product.itemSerial
      })
    }
    setSelectProducts(newSelectProducts)
  }

  return (
    <Drawer
      id='rootSidebar'
      items={(<CartItems items={selectProducts} />)}
      bottomItems={(<CartBottomItems items={selectProducts} />)}
      openIcon={MdShoppingCart}
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
          <div className='w-full p-4'>
            <select
              className='select select-bordered w-full max-w-xs'
              defaultValue={-1}
              onChange={onSelectType}
            >
              <option value={-1} disabled>Select fish type</option>
              {fishTypes.map((type) => {
                const { label, value } = type
                return (
                  <option value={value} key={value} selected={value === fishType}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div className='flex flex-wrap'>
          {isFishDataLoading && <p>loading</p>}
          {!isFishDataLoading && fishData.map((item) => (
            <Card
              key={item.itemSerial}
              item={item}
              onImageClick={openProductModal(item)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
      <ProductModel
        id={productModelKey}
        visible={isProductModalOpen}
        onClose={closeProductModal}
        product={targetProduct}
      />
    </Drawer>
  )
}

export default Home
