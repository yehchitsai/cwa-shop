import clx from 'classnames'
import { useTranslation } from 'react-i18next'
import { size } from 'lodash-es'

const CartItems = (props) => {
  const { items = [], onClick = () => {}, className } = props
  const { t } = useTranslation()
  const selectedSize = size(items)
  const isNoProductSelected = selectedSize === 0
  if (isNoProductSelected) {
    return (
      <li disabled>
        <span>
          {`${t('cartInfo')}`}
        </span>
      </li>
    )
  }

  return items.map((item, index) => {
    return (
      <li
        key={index}
        onClick={() => onClick({ item, index })}
        className={clx({ [className]: className })}
      >
        <span>{item}</span>
      </li>
    )
  })
}

export default CartItems
