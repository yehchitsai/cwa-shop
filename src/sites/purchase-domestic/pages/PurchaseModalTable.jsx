import { useEffect } from 'react'
import { Field, useFormikContext } from 'formik'
import clx from 'classnames'
import { isEmpty } from 'lodash-es'
import { FaEye } from 'react-icons/fa'
import { FORM_ITEM } from './constants'
import FieldError from '../../../components/Form/FieldError'

const PurchaseModalTable = (props) => {
  const { rowData = {}, isAddToCart, disabled } = props
  const { setValues, values } = useFormikContext()
  const editable = (!disabled && isAddToCart)
  const {
    fish_name,
    fish_code,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    group,
    note,
    video_links: videos = [],
    image_links: images = [],
    quantity = 0
  } = values
  const isOverviewBtnDisabled = (
    isEmpty(videos) && isEmpty(images)
  )

  const onViewFiles = () => {
    const element = document.querySelector(`#view-file-btn-${fish_code}`).click()
    if (!element) {
      return
    }
    element.click()
  }

  useEffect(() => {
    setValues({ ...rowData, quantity: rowData.quantity || 0 })
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
            <td>{inventory === -1 ? '無上限' : inventory}</td>
          </tr>
          <tr>
            <td>最低訂購量 (隻/組)</td>
            <td>{min_purchase_quantity}</td>
          </tr>
          <tr>
            <td>按組購買</td>
            <td>{`${group} 隻/組`}</td>
          </tr>
          <tr>
            <td>說明</td>
            <td>{note}</td>
          </tr>
          <tr>
            <td>購買數量</td>
            <td>
              <FieldError name={FORM_ITEM.QUANTITY}>
                <div className='join'>
                  <Field
                    name={FORM_ITEM.QUANTITY}
                    type='text'
                    inputMode='numeric'
                    className={clx(
                      'input input-bordered join-item w-full lg:max-w-xs',
                      { '!text-black': !editable }
                    )}
                    min={min_purchase_quantity}
                    placeholder={inventory === -1 ? '無上限' : ''}
                    disabled={!editable}
                    autoComplete='off'
                  />
                  <input
                    className='input join-item input-bordered min-w-[130px]'
                    value={`(組) 共 ${quantity * group} 隻`}
                    readOnly
                  />
                </div>
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
          <tr>
            <td colSpan={2}>
              <button
                type='button'
                className='btn btn-md w-full'
                disabled={!editable || isOverviewBtnDisabled}
                onClick={onViewFiles}
              >
                <FaEye
                  className='!fill-indigo-500'
                />
                檢視
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PurchaseModalTable
