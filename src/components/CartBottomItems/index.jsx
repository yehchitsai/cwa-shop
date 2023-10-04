import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import {
  get,
  size, sumBy
} from 'lodash-es'

const CartBottomItems = (props) => {
  const { t } = useTranslation()
  const { items = [], fishTypeMap = {} } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  const totalPrice = sumBy(items, (item) => get(fishTypeMap, `${item.fishType}.fishPrice`))
  return (
    <>
      <li key='totalCount'>
        <span>{`Total count: ${selectedSize}`}</span>
      </li>
      <li key='totalPrice'>
        <span>{`Total price: ${totalPrice} ${t('currency')}`}</span>
      </li>
      <Link to='/confirm'>
        <button
          type='button'
          className={clx(
            'btn btn-primary btn-outline btn-md w-full my-1',
            { 'btn-disabled': isNoProductSelected }
          )}
        >
          Confirm order
        </button>
      </Link>
    </>
  )
}

export default CartBottomItems
