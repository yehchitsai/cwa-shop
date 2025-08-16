import { Link } from 'react-router-dom'
import { MdCheckCircle } from 'react-icons/md'
import { useAtomValue } from 'jotai'
import { orderDataState } from '../../../../state/orderData'

const Complete = () => {
  const {
    orderTotalQuantity = 0,
    orderTotalPrice = 0,
    currency = 'TWD'
  } = useAtomValue(orderDataState)

  return (
    <div className='hero fixed min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md text-center'>
          <h1 className='text-4xl font-bold text-green-500'>
            <MdCheckCircle className='m-auto' size='1.5em' />
            {' Order complete!'}
          </h1>
          <h3 className='my-12'>
            <p className='my-2'>{`orderTotalQuantity: ${orderTotalQuantity}`}</p>
            <p className='my-2'>{`orderTotalPrice: ${orderTotalPrice} ${currency}`}</p>
          </h3>
          <Link to='../' relative='path' className='btn btn-primary'>
            Back to products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Complete
