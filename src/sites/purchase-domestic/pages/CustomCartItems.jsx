import { get, map } from 'lodash-es'
import CartItems from '../../../components/CartItems'

const CustomCartItems = (props) => {
  const { cart, selectProductMap = {} } = props
  const items = get(cart, 'items', [])
  const customItems = map(items, (item) => {
    const { fish_code, quantity = 0 } = item
    const fishName = get(selectProductMap, `${fish_code}.fish_name`, fish_code)
    return `${fishName} x ${quantity}`
  })
  return (
    <CartItems items={customItems} />
  )
}

export default CustomCartItems
