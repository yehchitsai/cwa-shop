import {
  MdEdit, MdDelete, MdCheckCircle, MdError, MdCloudUpload, MdOutlineRefresh
} from 'react-icons/md'
import clx from 'classnames'
import { toString } from 'lodash-es'
import useRecognition from '../../../../hooks/useRecognition'

const getRecognitionState = (status) => {
  let isLoading = false
  let isSuccess = false
  let isError = false
  if (status === 'loading') {
    isLoading = true
  }

  if (status === 'success') {
    isSuccess = true
  }

  if (status === 'fail') {
    isError = true
  }

  return { isLoading, isSuccess, isError }
}

const TableRow = (props) => {
  const {
    item, field, index, onRemove, onEdit, onUpdated
  } = props
  const {
    trigger, isLoading, status, data, error
  } = useRecognition(item, (newData) => onUpdated(field, {
    uploadFile: item,
    recognitionData: newData,
    isUploaded: true
  }))
  const state = getRecognitionState(status)

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
          {item.name}
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
              <span>{data.itemSerial}</span>
            )}
            {state.isError && (
              <span className='text-error'>{toString(error)}</span>
            )}
          </td>
          <td>{data.fishType}</td>
        </>
      )}
      <td className='w-4'>
        {!state.isError && (
          <button
            type='button'
            className='btn btn-square'
            disabled={isLoading}
            onClick={() => onEdit({ index, item, data })}
          >
            <MdEdit size='1.5em' />
          </button>
        )}
        {state.isError && (
          <button
            type='button'
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
