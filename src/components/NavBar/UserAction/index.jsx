import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

const User = () => {
  const data = useLoaderData()
  return (
    <Suspense fallback={<span>Loading</span>}>
      <Await
        resolve={data.message}
        errorElement={<span>Error</span>}
      >
        {(message) => message}
      </Await>
    </Suspense>
  )
}

const UserAction = (props) => {
  const { fixed } = props
  return (
    <div className='btn btn-ghost'>
      <div
        className='tooltip tooltip-bottom'
        data-tip={`v${window.APP_VERSION}`}
      >
        <span className='max-sm:hidden'>
          {fixed ? <FaUserCircle size='1.5em' /> : <User />}
        </span>
        <FaUserCircle className='md:hidden' size='1.5em' />
      </div>
    </div>
  )
}

export default UserAction
