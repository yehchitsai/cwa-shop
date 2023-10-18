import clx from 'classnames'

const SkeletonHome = ({ className }) => (
  <div
    className={clx(
      'hero min-h-full',
      { [className]: className }
    )}
  >
    <div className='hero-content text-center'>
      <div className='max-w-md'>
        <progress className='progress w-56' />
      </div>
    </div>
  </div>
)

export default SkeletonHome
