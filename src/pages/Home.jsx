import { Link } from 'react-router-dom'
import { MdShoppingCart } from 'react-icons/md'
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

const Home = () => {
  const { data, isLoading } = useFishData()
  if (isLoading) {
    return <SkeletonHome />
  }

  const openProductModal = () => document.querySelector('#productModel').showModal()
  return (
    <Drawer
      id='rootSidebar'
      items={(
        <>
          <li><span>Sidebar Item 1</span></li>
          <li><span>Sidebar Item 2</span></li>
        </>
      )}
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
              onImageClick={openProductModal}
            />
          ))}
        </div>
      </div>
      <ProductModel id='productModel' />
    </Drawer>
  )
}

export default Home
