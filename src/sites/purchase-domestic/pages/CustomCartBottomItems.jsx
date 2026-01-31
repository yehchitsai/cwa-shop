import { useTranslation } from 'react-i18next'
import { map } from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'

// Helper to coerce values to safe numbers, preventing NaN rendering
const toSafeNumber = (v) => {
  if (v === null || v === undefined) return 0.0
  // handle strings with commas or whitespace
  const num = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(num) ? num : 0.0
}

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
  const safeTotalPrice = toSafeNumber(total_price)
  const safeTotalDiscountAmt = toSafeNumber(total_discount_amt)
  const customItems = [
    <details open>
      <summary>
        {`總折扣: ${safeTotalDiscountAmt}`}
      </summary>
      <ul>
        {map(discounts, (discount, index) => {
          const { type, discount_amt } = discount
          const safeDiscountAmt = toSafeNumber(discount_amt)
          return (
            <li key={index}>
              <a href='void:(0)'>
                {`${type} ${safeDiscountAmt}`}
              </a>
            </li>
          )
        })}
      </ul>
    </details>,
    `${t('totalCount')}: ${new Intl.NumberFormat('en-US').format(total_quantity)}`,
    `${t('totalPrice')}: ${`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeTotalPrice)} NTD`}`
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
