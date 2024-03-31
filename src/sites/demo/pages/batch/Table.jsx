import { useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import { get, isUndefined, some } from 'lodash-es'
import useQueue from '../../../../hooks/useQueue'
import { FORM, FORM_ITEM } from './constants'
import TableRow from './TableRow'

const Table = (props) => {
  const {
    onRemove,
    onEdit,
    onUpdated,
    isCalculating
  } = props
  const { queue, controller } = useQueue()
  const { values } = useFormikContext()
  const data = get(values, FORM.ROWS)
  const [isUploading, setIsUploading] = useState(false)
  const isDisabledAction = isUploading || isCalculating

  useEffect(() => {
    const nextIsUploading = some(data, (row) => isUndefined(row[FORM_ITEM.RECOGNITION_DATA]))
    if (isUploading === nextIsUploading) {
      return
    }

    setIsUploading(nextIsUploading)
  }, [data, isUploading])

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
          {data.map((item, index) => {
            const fileName = get(item, 'uploadFile.name')
            return (
              <TableRow
                key={fileName}
                fileName={fileName}
                item={item}
                index={index}
                onRemove={onRemove}
                onEdit={onEdit}
                onUpdated={onUpdated}
                queue={queue}
                controller={controller}
                isDisabledAction={isDisabledAction}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
