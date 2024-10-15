import { useTranslation } from 'react-i18next'
import { map } from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'

const CustomCartBottomItems = (props) => {
  const { t } = useTranslation()
  const {
    cart: {
      total_price,
      total_quantity,
      total_discount_amt = 0,
      discounts = []
    } = {}
  } = props
  const customItems = [
    `總折扣: ${total_discount_amt}`,
    ...map(discounts, (discount) => {
      const { type, discount_amt } = discount
      return (
        <p>{`${type} ${discount_amt}`}</p>
      )
    }),
    `${t('totalCount')}: ${total_quantity}`,
    `${t('totalPrice')}: ${total_price}`
  ]
  return (
    <CartBottomItems
      items={customItems}
      confirmLinkTo='./confirm'
      confirmLinkText={`${t('confirmOrder')}`}
    />
  )
}

export default CustomCartBottomItems
