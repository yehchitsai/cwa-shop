import { useTranslation } from 'react-i18next'
import { map } from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'
import toSafeNumber from '../../../utils/numberUtils'

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
  const actualPaymentAmount = safeTotalPrice - safeTotalDiscountAmt
  const customItems = [
    <details open>
      <summary>
        {`總折扣: ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeTotalDiscountAmt)} NTD`}
      </summary>
      <ul>
        {map(discounts, (discount, index) => {
          const { type, discount_amt } = discount
          const safeDiscountAmt = toSafeNumber(discount_amt)
          return (
            <li key={index}>
              <a href='void:(0)'>
                {`${type} ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeDiscountAmt)} NTD`}
              </a>
            </li>
          )
        })}
      </ul>
    </details>,
    `${t('totalCount')}: ${new Intl.NumberFormat('en-US').format(total_quantity)}`,
    `${t('totalPrice')}: ${`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(safeTotalPrice)} NTD`}`,
    `實際付款金額: ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(actualPaymentAmount)} NTD`
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
