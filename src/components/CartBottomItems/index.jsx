import { Link } from 'react-router-dom'
import clx from 'classnames'
import { size } from 'lodash-es'

const CartBottomItems = (props) => {
  const { items = [], confirmLinkTo, confirmLinkText } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  return (
    <>
      {items.map((item, index) => {
        return (
          <li key={index}>
            <span>{item}</span>
          </li>
        )
      })}
      <Link
        to={confirmLinkTo}
        className={clx({ 'pointer-events-none': isNoProductSelected })}
      >
        <button
          type='button'
          className={clx(
            'btn btn-primary btn-outline btn-md w-full my-1',
            { 'btn-disabled': isNoProductSelected }
          )}
        >
          {confirmLinkText}
        </button>
      </Link>
    </>
  )
}

export default CartBottomItems
