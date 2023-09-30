import NavBar from '../NavBar'

const Layout = () => (
  <div className='hero min-h-screen bg-base-200'>
    <div className='hero-content text-center'>
      <div className='max-w-md'>
        <NavBar />
        <progress className='progress w-56' />
      </div>
    </div>
  </div>
)

export default Layout
