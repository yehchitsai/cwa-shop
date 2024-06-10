import { useTranslation } from 'react-i18next'
import {
  size
} from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'

const CustomCartBottomItems = (props) => {
  const { t } = useTranslation()
  const { items = [] } = props
  const selectedSize = size(items)
  const customItems = [
    `${t('totalCount')}: ${selectedSize}`,
    `${t('totalPrice')}: ${0} ${'xx'}`
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
