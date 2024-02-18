const FormLayout = (props) => {
  const { children } = props
  return (
    <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
      {children}
    </div>
  )
}

export default FormLayout
