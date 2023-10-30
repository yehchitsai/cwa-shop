const FormRow = (props) => {
  const {
    children, label, required, error, counter
  } = props
  return (
    <div className='form-control mb-2 w-full'>
      <label className='label'>
        <span className='label-text'>
          {label}
          {required ? (<span className='px-1 font-bold text-red-700'>*</span>) : null}
        </span>
      </label>
      {children}
      <label className='label'>
        <span className='label-text-alt text-red-700'>{error}</span>
        <span className='label-text-alt'>{counter}</span>
      </label>
    </div>
  )
}

export default FormRow
