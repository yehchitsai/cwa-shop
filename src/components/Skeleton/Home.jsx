const SkeletonHome = ({ children }) => (
  <div className='hero min-h-[100vh]'>
    <div className='hero-content text-center'>
      <div className='max-w-md'>
        {children}
        <progress className='progress w-56 translate-y-[30%]' />
      </div>
    </div>
  </div>
)

export default SkeletonHome
