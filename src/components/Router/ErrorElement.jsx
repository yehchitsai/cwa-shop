import { useRouteError, Link } from 'react-router-dom'
import { FaRoadCircleXmark } from 'react-icons/fa6'

const ErrorElement = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>
            <FaRoadCircleXmark
              size='2em'
              className='mx-auto'
            />
            Oops!
          </h1>
          <p className='py-3'>Sorry, an unexpected error has occurred.</p>
          <p className='py-3'>{error.statusText || error.message}</p>
          <Link to='../'>
            <button type='button' className='btn btn-primary'>Back to home</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorElement
