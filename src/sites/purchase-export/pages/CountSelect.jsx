import clx from 'classnames'
import { times } from 'lodash-es'

const CountSelect = (props) => {
  const { max = 1, className } = props
  return (
    <select
      className={clx(
        'select select-sm select-bordered w-full',
        { [className]: className }
      )}
      // onChange={onSelectType}
      defaultValue={1}
    >
      <option value={-1} disabled>選擇數量</option>
      {times(max, (index) => {
        const count = index + 1
        return (
          <option value={count} key={count}>
            {`${count} 隻`}
          </option>
        )
      })}
    </select>
  )
}

export default CountSelect
