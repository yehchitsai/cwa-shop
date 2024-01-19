import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import {
  flow,
  get,
  round,
  size, sumBy
} from 'lodash-es'
import useFishTypes from '../../hooks/useFishTypes'

const CartBottomItems = (props) => {
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const {
    fishTypeMap
  } = useFishTypes(i18n.language)
  const { items = [] } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  const totalPrice = flow(
    () => sumBy(items, (item) => +get(fishTypeMap, `${item.fishType}.fishPrice`)),
    (summaryPrice) => round(summaryPrice, 2)
  )()
  const currency = get(fishTypeMap, `${get(items, '0.fishType')}.currency`, '')
  return (
    <>
      <li key='totalCount'>
        <span>{`${t('totalCount')}: ${selectedSize}`}</span>
      </li>
      <li key='totalPrice'>
        <span>{`${t('totalPrice')}: ${totalPrice} ${currency}`}</span>
      </li>
      <Link to='/confirm'>
        <button
          type='button'
          className={clx(
            'btn btn-primary btn-outline btn-md w-full my-1',
            { 'btn-disabled': isNoProductSelected }
          )}
        >
          {`${t('confirmOrder')}`}
        </button>
      </Link>
    </>
  )
}

export default CartBottomItems
