import {
  MdEdit, MdDelete, MdCheckCircle, MdError, MdCloudUpload, MdOutlineRefresh
} from 'react-icons/md'
import { IoMdCloseCircle } from 'react-icons/io'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import { get, toString } from 'lodash-es'
import useRecognition from '../../../../hooks/useRecognition'
import useFishTypes from '../../../../hooks/useFishTypes'
import { FORM_ITEM } from './constants'

const STATUS_MESSAGE_MAP = {
  pending: 'pending, please retry later',
  fail: 'recognition failed'
}

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
  const errorMessage = get(error, 'message', toString(error))
  const isPending = (errorMessage === 'pending')

  return (
    <tr>
      <th>{`${index + 1}.`}</th>
      <td>
        <div
          className={clx(
            'badge gap-2 border-none whitespace-nowrap'
          )}
        >
          {state.isSuccess && (<MdCheckCircle className='fill-success' size='1.5em' />)}
          {(state.isError && !isPending) && (
            <IoMdCloseCircle className='fill-error' size='1.5em' />
          )}
          {(state.isError && isPending) && (
            <MdError className='fill-warning' size='1.5em' />
          )}
          {state.isLoading && (<MdCloudUpload size='1.5em' />)}
          {item[FORM_ITEM.UPLOAD_FILE].name}
        </div>
      </td>
      {isLoading && (
        <>
          <td>
            <div className='skeleton h-8 w-full' />
          </td>
          <td>
            <div className='skeleton h-8 w-full' />
          </td>
        </>
      )}
      {!isLoading && (
        <>
          <td className='whitespace-nowrap'>
            {!state.isError && (
              <span>{formData.itemSerial}</span>
            )}
            {state.isError && (
              <span
                className={clx(
                  { 'text-error': !isPending },
                  { 'text-warning': isPending }
                )}
              >
                {get(STATUS_MESSAGE_MAP, errorMessage, errorMessage)}
              </span>
            )}
          </td>
          <td>
            {!state.isError && (
              <span className='whitespace-nowrap'>
                {`${get(fishTypeMap, `${formData.fishType}.fishName`, '')}(${formData.fishType})`}
              </span>
            )}
            {state.isError && (
              <span>{' '}</span>
            )}
          </td>
        </>
      )}
      <th>
        <div className='space-x-4 text-right max-lg:w-32'>
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
          <button
            type='button'
            className='btn btn-square'
            disabled={isLoading}
            onClick={() => onRemove(index)}
          >
            <MdDelete size='1.5em' />
          </button>
        </div>
      </th>
    </tr>
  )
}

export default TableRow
