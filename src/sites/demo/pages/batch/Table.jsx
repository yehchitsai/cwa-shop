import TableRow from './TableRow'

const Table = (props) => {
  const {
    field,
    data,
    onRemove,
    onEdit,
    onUpdated
  } = props

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
              key={index}
              onRemove={onRemove}
              onEdit={onEdit}
              onUpdated={onUpdated}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
