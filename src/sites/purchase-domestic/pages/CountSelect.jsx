import clx from 'classnames'
import { Field } from 'formik'
import { times } from 'lodash-es'

const CountSelect = (props) => {
  const {
    max = 1, className, name
  } = props
  return (
    <Field
      as='select'
      name={name}
      className={clx(
        'select select-sm select-bordered w-full',
        { [className]: className }
      )}
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
    </Field>
  )
}

export default CountSelect
