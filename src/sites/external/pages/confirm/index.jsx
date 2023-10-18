import { useState } from 'react'
// import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { MdDelete } from 'react-icons/md'
import {
  flow, get, size, sumBy, groupBy, reduce
} from 'lodash-es'
import {
  key as selectedProductsStateKey,
  selectedProductsState
} from '../../../../state/selectedProducts'
import useFishTypes from '../../../../hooks/useFishTypes'
import SkeletonHome from '../../../../components/Skeleton/Home'
import LazyImage from '../../../../components/LazyImage'
import ProductModel from '../../../../components/Model/Product'

const productModelKey = 'productModel'

const Confirm = () => {
  const { t, i18n } = useTranslation()
  const { fishTypeMap, isLoading } = useFishTypes(i18n.language)
  const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState)
  const [targetProduct, setTargetProduct] = useState({})
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const selectedTypes = flow(
    () => groupBy(selectedProducts, (selectedProduct) => selectedProduct.fishType),
    (groupedProducts) => reduce(groupedProducts, (data, products, fishType) => {
      data.push({
        fishName: get(fishTypeMap, `${fishType}.fishName`),
        count: size(products)
      })
      return data
    }, [])
  )()

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct(newTargetProduct)
    setIsProductModalOpen(true)
    document.querySelector(`#${productModelKey}`).showModal()
  }

  const closeProductModal = () => setIsProductModalOpen(false)

  const onRemove = (product) => () => {
    const newSelectedProducts = selectedProducts.filter((selectedProduct) => {
      return selectedProduct.itemSerial !== product.itemSerial
    })
    setSelectedProducts(newSelectedProducts)
    window.localStorage.setItem(selectedProductsStateKey, JSON.stringify(newSelectedProducts))
  }

  const onRemoveAll = () => {
    setSelectedProducts([])
    window.localStorage.removeItem(selectedProductsStateKey)
  }

  if (isLoading) {
    return (
      <SkeletonHome />
    )
  }

  return (
    <>
      <div
        className='m-auto h-auto overflow-x-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
      >
        <table className='table table-pin-cols'>
          <thead>
            <tr>
              <th />
              <th className='z-[1]'>Image</th>
              <th>FishType Name</th>
              <th>ItemSerial</th>
              <th>ItemPrice</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((selectedProduct, index) => {
              const {
                imageURL, itemSerial, itemPrice, fishType
              } = selectedProduct
              const { fishName } = get(fishTypeMap, fishType, {})
              return (
                <tr key={itemSerial}>
                  <th>{index + 1}</th>
                  <th>
                    <LazyImage
                      src={imageURL}
                      className='mask mask-square m-0 h-20 w-20 cursor-pointer'
                      alt={fishName}
                      loaderClassName='mask mask-square w-20 h-20'
                      onClick={openProductModal(selectedProduct)}
                    />
                  </th>
                  <td>{fishName}</td>
                  <td>{itemSerial}</td>
                  <td>{`${itemPrice} ${t('currency')}`}</td>
                  <th>
                    <button
                      type='button'
                      className='btn btn-square btn-error btn-outline'
                      onClick={onRemove(selectedProduct)}
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
              <th colSpan={2} className='z-10'>Total selected</th>
              <th colSpan={2}>Fish types</th>
              <th>Total price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>{`${size(selectedProducts)}`}</th>
              <td colSpan={2}>
                {selectedTypes.map(({ fishName, count }) => (
                  <p key={fishName}>{`${fishName} x ${count}`}</p>
                ))}
              </td>
              <td>
                {`${sumBy(selectedProducts, (selectedProduct) => (get(fishTypeMap, `${selectedProduct.fishType}.fishPrice`)))} ${t('currency')}`}
              </td>
              <th className='space-y-2'>
                <button
                  type='button'
                  className='btn btn-success btn-outline'
                >
                  Submit cart
                </button>
                <br />
                <button
                  type='button'
                  className='btn btn-error btn-outline'
                  onClick={onRemoveAll}
                >
                  Remove all
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <ProductModel
        id={productModelKey}
        visible={isProductModalOpen}
        onClose={closeProductModal}
        product={targetProduct}
        fishTypeMap={fishTypeMap}
      />
    </>
  )
}

export default Confirm
