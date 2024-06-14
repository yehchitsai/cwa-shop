import { useTranslation } from 'react-i18next'
import {
  flow,
  get,
  round,
  size, sumBy
} from 'lodash-es'
import useFishTypes from '../../../hooks/useFishTypes'
import CartBottomItems from '../../../components/CartBottomItems'

const CustomCartBottomItems = (props) => {
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const {
    fishTypeMap
  } = useFishTypes(i18n.language)
  const { items = [] } = props
  const selectedSize = size(items)
  const totalPrice = flow(
    () => sumBy(items, (item) => +get(fishTypeMap, `${item.fishType}.fishPrice`)),
    (summaryPrice) => round(summaryPrice, 2)
  )()
  const currency = get(fishTypeMap, `${get(items, '0.fishType')}.currency`, '')
  const customItems = [
    `${t('totalCount')}: ${selectedSize}`,
    `${t('totalPrice')}: ${totalPrice} ${currency}`
  ]
  const isNoProductSelected = selectedSize === 0
  return (
    <CartBottomItems
      items={customItems}
      isNoProductSelected={isNoProductSelected}
      confirmLinkTo='./confirm'
      confirmLinkText={`${t('confirmOrder')}`}
    />
  )
}

export default CustomCartBottomItems
