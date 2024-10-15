import { useFormik } from 'formik'
import { useEffect } from 'react'
import { isEqual, map } from 'lodash-es'
import clx from 'classnames'
import { MdOutlineDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import CountSelect from '../CountSelect'
import usePrepurchaseOrder from '../../../../hooks/usePrepurchaseOrder'

const initCart = {
  discounts: [],
  items: [],
  total_price: '0',
  total_quantity: '0'
}

const Confirm = () => {
  const formik = useFormik({
    initialValues: [],
    onSubmit: console.log
  })
  const { t } = useTranslation()
  const { data = initCart } = usePrepurchaseOrder()
  const {
    items,
    total_price
  } = data

  useEffect(() => {
    if (isEqual(formik.values, items)) {
      return
    }
    formik.setValues(items)
  }, [items, formik])

  return (
    <form
      onSubmit={formik.handleSubmit}
      // initialValues={items}
      // onSubmit
    >
      <div
        className='m-auto h-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
      >
        {/* <div className='h-[calc(100dvh-5.5rem)] overflow-x-auto'> */}
        <div className='h-[calc(100dvh-8.5rem)] overflow-x-auto'>
          <table className='table table-pin-rows table-pin-cols'>
            <thead>
              <tr className='max-sm:-top-1'>
                <th>項次</th>
                <td>品名</td>
                <td>尺寸</td>
                <td>單價</td>
                <td className='min-w-32'>購買數量</td>
                <td>特殊要求</td>
                <td>金額</td>
                <th />
              </tr>
            </thead>
            <tbody>
              {map(items, (item, index) => {
                const {
                  fish_name,
                  fish_size,
                  unit_price,
                  retail_price,
                  min_purchase_quantity,
                  quantity,
                  request
                } = item
                return (
                  <tr
                    key={index}
                    className={clx(
                      'whitespace-nowrap cursor-pointer'
                    )}
                  >
                    <th className='text-sm'>
                      {index + 1}
                    </th>
                    <td>{fish_name}</td>
                    <td>{fish_size}</td>
                    <td>{unit_price}</td>
                    <td>
                      <CountSelect
                        max={min_purchase_quantity}
                        defaultValue={quantity}
                        name={`${index}.quantity`}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        className='input input-sm input-bordered w-40'
                        defaultValue={request}
                      />
                    </td>
                    <td>{retail_price}</td>
                    <th className='text-right'>
                      <button
                        type='button'
                        className='btn btn-square btn-outline btn-error'
                      >
                        <MdOutlineDelete
                          size='1.5em'
                        />
                      </button>
                    </th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='my-2 mr-4 flex justify-end space-x-2'>
          <div className='mr-4 flex items-center justify-center break-all'>
            總金額：
            <br />
            {`${total_price} NTD`}
          </div>
          <div>
            <button
              type='submit'
              className='btn btn-outline btn-success'
              // disabled={isUpdating}
              // onClick={onOrder}
            >
              {`${t('submitCart')}`}
            </button>
          </div>
          <div>
            <button
              type='button'
              className='btn btn-outline btn-error'
              // onClick={onRemoveAll}
              // disabled={isUpdating}
            >
              {`${t('removerAll')}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Confirm
