import clx from 'classnames'
import { Field } from 'formik'
import { times } from 'lodash-es'

const CountSelect = (props) => {
  const {
    max = 1, min = 1, className, name, disabled
  } = props

  return (
    <Field
      as='select'
      name={name}
      className={clx(
        'select select-sm select-bordered w-full',
        { [className]: className }
      )}
      disabled={disabled}
    >
      <option value={-1} disabled>選擇數量</option>
      {times(max - min + 1, (index) => {
        const count = min + index
        return (
          <option value={count} key={count}>
            {`${count} 隻`}
          </option>
        )
      })}
    </Field>
  )
}

export default CountSelect
