import clx from 'classnames'

const FormRow = (props) => {
  const {
    children, label, required, error, counter, className
  } = props
  return (
    <div
      className={clx(
        'mb-2 w-full',
        { [className]: className }
      )}
    >
      <label className='label'>
        <span className='label-text'>
          {label}
          {required ? (<span className='px-1 font-bold text-red-400'>*</span>) : null}
        </span>
      </label>
      {children}
      <div className='mt-1 text-sm text-red-400' style={{ minHeight: '1.25rem' }}>
        {error || '\u00A0'}
      </div>
      {counter && (
        <div className='mt-1 text-sm text-right'>{counter}</div>
      )}
    </div>
  )
}

export default FormRow
