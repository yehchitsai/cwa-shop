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
  const safeTotalQuantity = Number.isFinite(Number(total_quantity)) ? total_quantity : 0
  const safeTotalPrice = Number.isFinite(Number(total_price)) ? total_price : 0
  const safeTrueTotalPrice = Number.parseFloat(safeTotalPrice - total_discount_amt).toFixed(2)
  const customItems = [
    <details key='discount-details' open>
      <summary>
        {`總折扣: ${total_discount_amt}`}
      </summary>
      <ul>
        {map(discounts, (discount, index) => {
          const { type, discount_amt } = discount
          return (
            <li key={index}>
              <a href='void:(0)'>
                {`${type} ${discount_amt}`}
              </a>
            </li>
          )
        })}
      </ul>
    </details>,
    `${t('totalCount')}: ${new Intl.NumberFormat('en-US').format(safeTotalQuantity)}`,
    `${t('totalPrice')}: ${`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeTotalPrice)}`}`,
    `實際付款金額: ${safeTrueTotalPrice}`
  ]
  return (
    <CartBottomItems
      items={customItems}
      confirmLinkTo='./confirm'
      confirmLinkText={`${t('confirmOrder')}`}
      showConfirmBtn={false}
    />
  )
}

export default CustomCartBottomItems
