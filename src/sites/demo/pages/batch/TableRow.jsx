import {
  MdEdit, MdDelete, MdCheckCircle, MdError, MdCloudUpload, MdOutlineRefresh
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import { get, toString } from 'lodash-es'
import useRecognition from '../../../../hooks/useRecognition'
import useFishTypes from '../../../../hooks/useFishTypes'
import { FORM_ITEM } from './constants'

const TableRow = (props) => {
  const {
    item, field, index, onRemove, onEdit, onUpdated
  } = props
  const { i18n } = useTranslation()
  const { fishTypeMap } = useFishTypes(i18n.language, false)
  const {
    trigger, isLoading, state, error
  } = useRecognition(item[FORM_ITEM.UPLOAD_FILE], (newData) => onUpdated(field, {
    ...item,
    [FORM_ITEM.RECOGNITION_DATA]: newData,
    [FORM_ITEM.IS_UPLOADED]: true
  }))
  const formData = get(item, FORM_ITEM.RECOGNITION_DATA, {})

  return (
    <tr>
      <th>{`${index + 1}.`}</th>
      <td>
        <div
          className={clx(
            'badge gap-2 border-none'
          )}
        >
          {state.isSuccess && (<MdCheckCircle className='fill-success' size='1.5em' />)}
          {state.isError && (<MdError className='fill-error' size='1.5em' />)}
          {state.isLoading && (<MdCloudUpload size='1.5em' />)}
          {item[FORM_ITEM.UPLOAD_FILE].name}
        </div>
      </td>
      {isLoading && (
        <>
          <td>
            <div className='skeleton h-4 w-full' />
          </td>
          <td>
            <div className='skeleton h-4 w-full' />
          </td>
        </>
      )}
      {!isLoading && (
        <>
          <td>
            {!state.isError && (
              <span>{formData.itemSerial}</span>
            )}
            {state.isError && (
              <span className='text-error'>{toString(error)}</span>
            )}
          </td>
          <td>
            {`${get(fishTypeMap, `${formData.fishType}.fishName`)}(${formData.fishType})`}
          </td>
        </>
      )}
      <td className='w-4'>
        {!state.isError && (
          <button
            type='button'
            className='btn btn-square'
            disabled={isLoading}
            onClick={() => onEdit({
              index, item: item[FORM_ITEM.UPLOAD_FILE], data: formData, field
            })}
          >
            <MdEdit size='1.5em' />
          </button>
        )}
        {state.isError && (
          <button
            type='button'
            data-role='triggerRefresh'
            className='btn btn-square'
            disabled={isLoading}
            onClick={() => trigger()}
          >
            <MdOutlineRefresh size='1.5em' />
          </button>
        )}
      </td>
      <td className='w-4'>
        <button
          type='button'
          className='btn btn-square'
          disabled={isLoading}
          onClick={() => onRemove(index)}
        >
          <MdDelete size='1.5em' />
        </button>
      </td>
    </tr>
  )
}

export default TableRow
