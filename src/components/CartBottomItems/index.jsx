import clx from 'classnames'
import {
  size, sumBy
} from 'lodash-es'

const CartBottomItems = (props) => {
  const { items = [] } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  return (
    <>
      <li key='totalCount'>
        <span>{`Total count: ${selectedSize}`}</span>
      </li>
      <li key='totalPrice'>
        <span>{`Total: ${sumBy(items, (item) => item.fishPrice)} NTD`}</span>
      </li>
      <button
        type='button'
        className={clx(
          'btn btn-primary btn-outline btn-md w-full my-1',
          { 'btn-disabled': isNoProductSelected }
        )}
      >
        Confirm order
      </button>
    </>
  )
}

export default CartBottomItems
