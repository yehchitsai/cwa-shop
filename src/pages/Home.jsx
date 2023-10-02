import { useState } from 'react'
import { Link } from 'react-router-dom'
import clx from 'classnames'
import { MdShoppingCart } from 'react-icons/md'
import {
  filter, groupBy, flow, reduce, size, sumBy
} from 'lodash-es'
import Card from '../components/Card'
import ProductModel from '../components/Model/Product'
import useFishData from '../hooks/useFishData'
import SkeletonHome from '../components/Skeleton/Home'
import Drawer from '../components/Drawer'

const options = [
  'Homer',
  'Marge',
  'Bart',
  'Lisa',
  'Maggie'
].map((option) => ({ label: option, value: option }))
const productModelKey = 'productModel'

const CartItems = (props) => {
  const { items = [] } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  if (isNoProductSelected) {
    return <li disabled><span>Cart is empty</span></li>
  }

  const cartList = flow(
    () => groupBy(items, (item) => item.type),
    (groupedItems) => reduce(groupedItems, (list, products, type) => {
      const newList = [...list, { index: size(products), type, products }]
      return newList
    }, []),
    (groupedProducts) => groupedProducts.map((item) => (
      <li key={item.type}><span>{`${item.type} X ${size(item.products)}`}</span></li>
    ))
  )()
  return cartList
}

const CartBottomItems = (props) => {
  const { items = [] } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  return (
    <>
      <li key='totalCount'>
        <span>{`Total count: ${selectedSize}`}</span>
      </li>
      <li key='totalPrice'>
        <span>{`Total: ${sumBy(items, (item) => item.price)} NTD`}</span>
      </li>
      <button
        type='button'
        className={clx(
          'btn btn-primary btn-outline btn-md w-full my-1',
          { 'btn-disabled': isNoProductSelected }
        )}
      >
        Confirm order
      </button>
    </>
  )
}

const Home = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState({})
  const [selectProducts, setSelectProducts] = useState([])
  const { data, isLoading } = useFishData()
  if (isLoading) {
    return <SkeletonHome />
  }

  const openProductModal = (newTargetProduct) => async () => {
    setTargetProduct(newTargetProduct)
    setIsProductModalOpen(true)
    document.querySelector(`#${productModelKey}`).showModal()
  }

  const closeProductModal = () => setIsProductModalOpen(false)

  const onSelectProduct = (product) => (e) => {
    const isSelected = e.target.checked
    let newSelectProducts = [...selectProducts]
    if (isSelected) {
      newSelectProducts = [...selectProducts, product]
    } else {
      newSelectProducts = filter(selectProducts, (selectProduct) => {
        return selectProduct.id !== product.id
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
      <div className='max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
        <Link to='/about'>about</Link>
        &nbsp;
        <Link to='/detail'>detail</Link>
        <br />
        <div className='flex flex-wrap'>
          <div className='w-full p-4'>
            <select className='select select-bordered w-full max-w-xs' defaultValue={-1}>
              <option value={-1} disabled>Select fish type</option>
              {options.map((option) => {
                const { label, value } = option
                return (
                  <option value={value} key={value}>{label}</option>
                )
              })}
            </select>
          </div>
        </div>
        <div className='flex flex-wrap'>
          {data.map((item) => (
            <Card
              key={`${item.id}${item.price}`}
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
