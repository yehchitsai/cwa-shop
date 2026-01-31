import { get, map } from 'lodash-es'
import { MdEdit } from 'react-icons/md'
import CartItems from '../../../components/CartItems'

const CustomCartItems = (props) => {
  const { cart, selectProductMap = {}, onClick } = props
  const items = get(cart, 'items', [])
  const customItems = map(items, (item) => {
    const { fish_code, quantity = 0, group = 0 } = item
    const fishName = get(selectProductMap, `${fish_code}.fish_name`, fish_code)
    const totalCount = quantity * group
    return (
      <p className='flex items-center justify-between gap-2'>
        <span>
          {`${fishName} x ${quantity}(隻)`}
          <span className='ml-1 text-sm text-gray-500'>
            {`(共 ${totalCount})`}
          </span>
        </span>
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
