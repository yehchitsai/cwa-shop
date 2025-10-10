import { get, map } from 'lodash-es'
import { MdEdit } from 'react-icons/md'
import CartItems from '../../../components/CartItems'

const CustomCartItems = (props) => {
  const { cart, selectProductMap = {}, onClick } = props
  const items = get(cart, 'items', [])
  const customItems = map(items, (item) => {
    const { fish_code, quantity = 0 } = item
    const fishName = get(selectProductMap, `${fish_code}.fish_name`, fish_code)
    return (
      <p className='flex items-center justify-between gap-2'>
        {`${fishName} x ${quantity}`}
        <MdEdit size='1.2em' />
      </p>
    )
  })
  return (
    <CartItems
      items={customItems}
      onClick={onClick}
      className='[&>span]:block'
    />
  )
}

export default CustomCartItems
