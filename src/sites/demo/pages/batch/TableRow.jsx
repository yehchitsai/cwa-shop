import {
  MdEdit, MdDelete
} from 'react-icons/md'
import useRowInfo from './useRowInfo'

// const aaa = { isLoading: false, data: {} }

const TableRow = (props) => {
  const {
    item, index, onRemove, onEdit
  } = props
  const { isLoading, data } = useRowInfo(item.url)
  // const { isLoading, data } = aaa
  // console.log(res)

  return (
    <tr>
      <th>{`${index + 1}.`}</th>
      <td>{item.name}</td>
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
          <td>{data.id}</td>
          <td>{data.fishType}</td>
        </>
      )}
      <td className='w-4'>
        <button
          type='button'
          className='btn btn-square'
          disabled={isLoading}
          onClick={() => onEdit({ index, item, data })}
        >
          <MdEdit size='1.5em' />
        </button>
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
