import { FaInfoCircle } from 'react-icons/fa'

const PurchaseAction = () => {
  return (
    <div className='dropdown dropdown-end form-control'>
      <label tabIndex={0} className='btn btn-ghost'>
        <FaInfoCircle size='1.5em' />
      </label>
      <ul
        tabIndex={0}
        className='menu dropdown-content z-10 mt-4 w-48 translate-y-10 rounded-box bg-base-100 p-2 shadow'
      >
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              店家名稱
            </span>
          </label>
        </li>
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              預計出貨日
            </span>
          </label>
        </li>
        <li>
          <label className='label cursor-pointer'>
            <span className='label-text'>
              報價單更新日期
            </span>
          </label>
        </li>
      </ul>
    </div>
  )
}

export default PurchaseAction
