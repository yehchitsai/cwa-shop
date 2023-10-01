import { Link } from 'react-router-dom'
import { times, random } from 'lodash-es'
import Card from '../components/Card'
import ProductModel from '../components/Model/Product'

const images = times(4, (index) => `img${index}.jpg`)
const fishData = times(random(20, 40), (index) => {
  const fishType = random(0, 3)
  return {
    index,
    id: index * random(10, 20),
    images: [images[fishType]],
    type: `Fish ${fishType}`,
    price: random(1000, 1500) * (index + 1)
  }
})

const Home = () => {
  const openProductModal = () => document.querySelector('#productModel').showModal()
  return (
    <>
      <div className='flex flex-wrap'>
        {fishData.map((item) => (
          <Card
            key={`${item.id}${item.price}`}
            item={item}
            onImageClick={openProductModal}
          />
        ))}
      </div>
      <ProductModel id='productModel' />
      <br />
      <Link to='/about'>about</Link>
      <br />
      <Link to='/detail'>detail</Link>
    </>
  )
}

export default Home
