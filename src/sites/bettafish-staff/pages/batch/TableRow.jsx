import { useFormikContext } from 'formik'
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
  fail: 'recognition failed',
  edit: 'some content can\'t recognize, please update field',
  video: 'No video found, please delete the row'
}

const RowIcon = (props) => {
  const { state, isPending, isUploaded } = props
  if (isUploaded) {
    return (
      <MdCheckCircle className='fill-success' size='1.5em' />
    )
  }

  if ((state.isError && !isPending)) {
    return (
      <IoMdCloseCircle className='fill-error' size='1.5em' />
    )
  }

  if (state.isError && isPending) {
    return (
      <MdError className='fill-warning' size='1.5em' />
    )
  }

  return (
    <MdCloudUpload size='1.5em' />
  )
}

const TableRow = (props) => {
  const {
    item, fileName, index, onRemove, onEdit, onUpdated,
    queue, controller, isDisabledAction
  } = props
  const formProps = useFormikContext()
  const { i18n } = useTranslation()
  const { fishTypeMap } = useFishTypes(i18n.language, false)
  const {
    trigger, isLoading, isRecognitionError, isNoVideo, state, error
  } = useRecognition(
    item[FORM_ITEM.UPLOAD_FILE],
    queue,
    controller,
    (newData, isSuccess) => onUpdated(formProps)(fileName, {
      [FORM_ITEM.RECOGNITION_DATA]: newData,
      [FORM_ITEM.IS_UPLOADED]: isSuccess
    })
  )
  const isUploaded = get(item, FORM_ITEM.IS_UPLOADED, false)
  const formData = get(item, FORM_ITEM.RECOGNITION_DATA, {})
  const errorMessage = isNoVideo
    ? 'video'
    : state.isNeedEdit
      ? 'edit'
      : get(error, 'message', toString(error))
  const isPending = (errorMessage === 'pending')

  const onRefresh = async () => {
    await onUpdated(formProps)(fileName, {
      [FORM_ITEM.RECOGNITION_DATA]: undefined,
      [FORM_ITEM.IS_UPLOADED]: false
    })
    trigger()
  }

  return (
    <tr>
      <th>{`${index + 1}.`}</th>
      <td>
        <div
          className={clx(
            'badge gap-2 border-none whitespace-nowrap'
          )}
        >
          <RowIcon
            state={state}
            isPending={isPending}
            isUploaded={isUploaded}
          />
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
            {(!state.isError || isUploaded) && (
              <span>{formData.itemSerial}</span>
            )}
            {(state.isError && !isUploaded) && (
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
            {(!state.isError || isUploaded) && (
              <span className='whitespace-nowrap'>
                {`${get(fishTypeMap, `${formData.fishType}.fishName`, '')}(${formData.fishType})`}
              </span>
            )}
            {(state.isError && !isUploaded) && (
              <span>{' '}</span>
            )}
          </td>
        </>
      )}
      <th>
        <div className='w-32 flex gap-4 justify-end'>
          {(!state.isError || isRecognitionError) && (
            <button
              type='button'
              className={clx('btn btn-square', { invisible: isNoVideo })}
              disabled={isLoading}
              onClick={() => onEdit({
                item: item[FORM_ITEM.UPLOAD_FILE],
                data: formData
              })}
            >
              <MdEdit size='1.5em' />
            </button>
          )}
          {(state.isError && !isRecognitionError) && (
            <button
              type='button'
              data-role='triggerRefresh'
              className={clx('btn btn-square', { invisible: isNoVideo })}
              disabled={isLoading}
              onClick={onRefresh}
            >
              <MdOutlineRefresh size='1.5em' />
            </button>
          )}
          <button
            type='button'
            className='btn btn-square'
            disabled={isLoading || isDisabledAction}
            onClick={() => onRemove(formProps)(fileName)}
          >
            <MdDelete size='1.5em' />
          </button>
        </div>
      </th>
    </tr>
  )
}

export default TableRow
