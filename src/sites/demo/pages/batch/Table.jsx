import useQueue from '../../../../hooks/useQueue'
import TableRow from './TableRow'

const Table = (props) => {
  const {
    field,
    data,
    onRemove,
    onEdit,
    onUpdated
  } = props
  const { queue, controller } = useQueue()

  return (
    <div className='mt-4 overflow-x-auto'>
      <table className='table table-pin-rows table-pin-cols table-xs'>
        <thead>
          <tr>
            <th />
            <td>Name</td>
            <td>Id</td>
            <td>FishType</td>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow
              field={`${field}.${index}`}
              item={item}
              index={index}
              key={item.uploadFile.name}
              onRemove={onRemove}
              onEdit={onEdit}
              onUpdated={onUpdated}
              queue={queue}
              controller={controller}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
