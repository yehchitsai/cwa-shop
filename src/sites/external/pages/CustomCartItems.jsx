import { useTranslation } from 'react-i18next'
import {
  groupBy, flow, reduce, size, get
} from 'lodash-es'
import useFishTypes from '../../../hooks/useFishTypes'
import CartItems from '../../../components/CartItems'

const CustomCartItems = (props) => {
  const { items = [] } = props
  const { i18n } = useTranslation()
  const {
    fishTypeMap
  } = useFishTypes(i18n.language)

  const customItems = flow(
    () => groupBy(items, (item) => item.fishType),
    (groupedItems) => reduce(groupedItems, (list, products, type) => {
      const newList = [...list, { index: size(products), type, products }]
      return newList
    }, []),
    (groupedProducts) => groupedProducts.map((item) => {
      const { fishName } = get(fishTypeMap, item.type, {})
      return `${fishName} X ${size(item.products)}`
    })
  )()
  return (
    <CartItems items={customItems} />
  )
}

export default CustomCartItems
