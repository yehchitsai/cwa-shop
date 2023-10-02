import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdShoppingCart } from 'react-icons/md'
import {
  filter, isEmpty, groupBy, flow, reduce, size
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
  if (isEmpty(items)) {
    return <li disabled><span>Cart is empty</span></li>
  }

  const cartList = flow(
    () => groupBy(items, (item) => item.type),
    (groupedItems) => reduce(groupedItems, (list, products, type) => {
      const newList = [...list, { index: size(products), type, products }]
      return newList
    }, [])
  )()
  return cartList.map((item) => (
    <li key={item.index}><span>{`${item.type} X ${size(item.products)}`}</span></li>
  ))
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
