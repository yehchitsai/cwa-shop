import { useField } from 'formik'
import clx from 'classnames'

const FieldError = (props) => {
  const { children, name } = props
  const [, meta] = useField({ name })
  const isError = meta.touched && meta.error
  return (
    <div
      className={clx('w-full', {
        'tooltip tooltip-open tooltip-error tooltip-bottom': isError,
        contents: !isError
      })}
      data-tip={meta.error}
    >
      {children}
    </div>
  )
}

export default FieldError
