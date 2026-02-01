import clx from 'classnames'

const Portal = (props) => {
  const { children, isFixed = false } = props
  return (
    <div
      className={clx(
        'hero min-h-screen bg-base-200',
        { 'fixed top-0': isFixed }
      )}
    >
      <div className='hero-content text-center'>
        <div className='flex flex-wrap justify-center max-sm:flex-col max-sm:gap-4 sm:flex-row sm:gap-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Portal
