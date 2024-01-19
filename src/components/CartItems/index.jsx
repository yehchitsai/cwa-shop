import { useTranslation } from 'react-i18next'
import {
  groupBy, flow, reduce, size, get
} from 'lodash-es'
import useFishTypes from '../../hooks/useFishTypes'

const CartItems = (props) => {
  const { items = [] } = props
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const {
    fishTypeMap
  } = useFishTypes(i18n.language)
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  if (isNoProductSelected) {
    return (
      <li disabled>
        <span>
          {`${t('cartInfo')}`}
        </span>
      </li>
    )
  }

  const cartList = flow(
    () => groupBy(items, (item) => item.fishType),
    (groupedItems) => reduce(groupedItems, (list, products, type) => {
      const newList = [...list, { index: size(products), type, products }]
      return newList
    }, []),
    (groupedProducts) => groupedProducts.map((item) => {
      const { fishName } = get(fishTypeMap, item.type, {})
      return (
        <li key={item.type}><span>{`${fishName} X ${size(item.products)}`}</span></li>
      )
    })
  )()
  return cartList
}

export default CartItems
