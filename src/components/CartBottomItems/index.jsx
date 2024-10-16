import { Link } from 'react-router-dom'
import clx from 'classnames'

const CartBottomItems = (props) => {
  const {
    items = [],
    isNoProductSelected,
    confirmLinkTo,
    confirmLinkText,
    showConfirmBtn = true
  } = props
  return (
    <>
      {items.map((item, index) => {
        return (
          <li key={index}>
            <span className='block'>{item}</span>
          </li>
        )
      })}
      {showConfirmBtn && (
        <Link
          to={confirmLinkTo}
          className={clx({ 'pointer-events-none': isNoProductSelected })}
        >
          <button
            type='button'
            className={clx(
              'btn btn-primary btn-outline btn-md w-full my-1 sticky bottom-2',
              { 'btn-disabled': isNoProductSelected }
            )}
          >
            {confirmLinkText}
          </button>
        </Link>
      )}
    </>
  )
}

export default CartBottomItems
