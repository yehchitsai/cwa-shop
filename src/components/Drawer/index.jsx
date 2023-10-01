import { MdShoppingCart, MdOutlineClose } from 'react-icons/md'

const Drawer = (props) => {
  const { children } = props
  return (
    <div className='drawer drawer-end lg:drawer-open'>
      <input id='my-drawer-4' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        {children}
        <label htmlFor='my-drawer-4' className='btn btn-square btn-primary btn-outline drawer-button fixed bottom-2 right-2 lg:hidden'>
          <MdShoppingCart size='2em' />
        </label>
      </div>
      <div className='drawer-side fixed top-[69px] h-[calc(100vh-69px)]'>
        <label htmlFor='my-drawer-4' aria-label='close sidebar' className='drawer-overlay lg:hidden' />
        <ul className='menu min-h-full w-80 bg-base-200 p-4 text-base-content'>
          {/* Sidebar content here */}
          <li className='max-lg:mb-14'>
            <label htmlFor='my-drawer-4' className='btn btn-square btn-outline drawer-button absolute right-2 lg:hidden'>
              <MdOutlineClose size='2em' />
            </label>
          </li>
          <li><span>Sidebar Item 1</span></li>
          <li><span>Sidebar Item 2</span></li>
        </ul>
      </div>
    </div>
  )
}

export default Drawer
