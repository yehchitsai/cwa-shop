import { useEffect } from 'react'
import { Field, useFormikContext } from 'formik'
import clx from 'classnames'
import { FORM_ITEM } from './constants'
import FieldError from '../../../components/Form/FieldError'

const PurchaseModalTable = (props) => {
  const { rowData = {}, isAddToCart, disabled } = props
  const { setValues, values } = useFormikContext()
  const editable = (!disabled && isAddToCart)
  const {
    fish_name,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    note
  } = values

  useEffect(() => {
    setValues(rowData)
  }, [setValues, rowData])

  return (
    <div className='m-4 rounded-box border border-base-200'>
      <table className='table table-sm'>
        <tbody>
          <tr>
            <td>品名</td>
            <td>{fish_name}</td>
          </tr>
          <tr>
            <td>尺寸</td>
            <td>{fish_size}</td>
          </tr>
          <tr>
            <td>單價</td>
            <td>{unit_price}</td>
          </tr>
          <tr>
            <td>建議零售價</td>
            <td>{retail_price}</td>
          </tr>
          <tr>
            <td>在庫量</td>
            <td>{inventory}</td>
          </tr>
          <tr>
            <td>起購量</td>
            <td>{min_purchase_quantity}</td>
          </tr>
          <tr>
            <td>說明</td>
            <td>{note}</td>
          </tr>
          <tr>
            <td>購買數量</td>
            <td>
              <FieldError name={FORM_ITEM.QUANTITY}>
                <Field
                  name={FORM_ITEM.QUANTITY}
                  type='text'
                  inputMode='numeric'
                  className={clx(
                    'input input-bordered w-full lg:max-w-xs',
                    { '!text-black': !editable }
                  )}
                  min={min_purchase_quantity}
                  placeholder={inventory === -1 ? '無上限' : ''}
                  disabled={!editable}
                  autoComplete='off'
                />
              </FieldError>
            </td>
          </tr>
          <tr>
            <td>特殊要求</td>
            <td>
              <Field
                as='textarea'
                name={FORM_ITEM.REQUEST}
                className='textarea textarea-bordered w-full resize-none'
                disabled={!editable}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PurchaseModalTable
