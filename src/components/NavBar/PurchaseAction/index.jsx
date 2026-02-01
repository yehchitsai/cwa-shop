import { useMemo } from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { useLoaderData } from 'react-router-dom'
import { format } from 'date-fns'
import useGetCategoryList from '../../../hooks/useGetCategoryList'

const getOrderDate = (order_deadline) => {
  try {
    return format(new Date(order_deadline), 'yyyy-MM-dd HH:mm')
  } catch {
    return '--'
  }
}

const PurchaseAction = () => {
  const { message: user = '--' } = useLoaderData()
  const {
    data: {
      delivery_date = '--',
      update_date = '--',
      order_deadline = '--'
    } = {}
  } = useGetCategoryList()
  const order_date = useMemo(() => getOrderDate(order_deadline), [order_deadline])
  return (
    <div className='dropdown dropdown-end form-control'>
      <label tabIndex={0} className='btn btn-ghost'>
        <FaInfoCircle size='1.5em' />
      </label>
      <ul
        tabIndex={0}
        className='menu dropdown-content z-10 mt-4 w-72 rounded-box bg-base-100 p-2 shadow [&_label]:pointer-events-none'
      >
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              {`店家名稱：${user}`}
            </span>
          </label>
        </li>
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              {`預計出貨日：${delivery_date}`}
            </span>
          </label>
        </li>
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              {`報價單更新日期：${update_date}`}
            </span>
          </label>
        </li>
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              {`訂單截止日期：${order_date}`}
            </span>
          </label>
        </li>
      </ul>
    </div>
  )
}

export default PurchaseAction
