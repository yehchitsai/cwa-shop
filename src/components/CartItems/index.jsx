import {
  groupBy, flow, reduce, size, get
} from 'lodash-es'

const CartItems = (props) => {
  const { items = [] } = props
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  if (isNoProductSelected) {
    return <li disabled><span>Cart is empty</span></li>
  }

  const cartList = flow(
    () => groupBy(items, (item) => item.fishType),
    (groupedItems) => reduce(groupedItems, (list, products, type) => {
      const newList = [...list, { index: size(products), type, products }]
      return newList
    }, []),
    (groupedProducts) => groupedProducts.map((item) => {
      const { fishName } = get(item, 'products[0]', {})
      return (
        <li key={item.type}><span>{`${fishName} X ${size(item.products)}`}</span></li>
      )
    })
  )()
  return cartList
}

export default CartItems
