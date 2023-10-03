import {
  useMemo,
  useState
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MdShoppingCart } from 'react-icons/md'
import {
  filter, get, isEmpty
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
    fishTypeMap,
    isLoading: isFishTypesLoading
  } = useFishTypes(i18n.language)
  const fishType = useMemo(
    () => searchParams.get('fishType') || get(fishTypes, '0.value'),
    [searchParams, fishTypes]
  )
  const {
    data: fishData,
    isLoading: isFishDataLoading
  } = useFishData(fishType)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState({})
  const [selectProducts, setSelectProducts] = useState([])

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct({ ...newTargetProduct, fishType })
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
      newSelectProducts = [...selectProducts, { ...product, fishType }]
    } else {
      newSelectProducts = filter(selectProducts, (selectProduct) => {
        return selectProduct.itemSerial !== product.itemSerial
      })
    }
    setSelectProducts(newSelectProducts)
  }

  const isContentLoading = (
    isFishTypesLoading ||
    isFishDataLoading ||
    isEmpty(fishTypes)
  )

  return (
    <Drawer
      id='rootSidebar'
      items={(
        <CartItems items={selectProducts} fishTypeMap={fishTypeMap} />
      )}
      bottomItems={(
        <CartBottomItems items={selectProducts} fishTypeMap={fishTypeMap} />
      )}
      openIcon={MdShoppingCart}
      drawerContentClassName={clx(
        { 'm-0 p-0 w-full overflow-y-hidden': isContentLoading }
      )}
      overlay
      // indicator={2}
      isRoot
      rwd
    >
      <div
        className={clx(
          { 'max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl max-sm:p-4 sm:p-12': !isContentLoading }
        )}
      >
        <div className='flex flex-wrap'>
          <div className='w-full p-4'>
            <select
              className={clx(
                'select select-bordered w-full',
                { 'select-disabled': isFishTypesLoading }
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
        </div>
        {
          isFishDataLoading ? <SkeletonHome /> : (
            <div className='flex flex-wrap'>
              {fishData.map((item) => (
                <Card
                  key={item.itemSerial}
                  item={item}
                  onImageClick={openProductModal(item)}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )
        }
      </div>
      <ProductModel
        id={productModelKey}
        visible={isProductModalOpen}
        onClose={closeProductModal}
        product={targetProduct}
        fishTypeMap={fishTypeMap}
      />
    </Drawer>
  )
}

export default Home
