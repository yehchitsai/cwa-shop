import clx from 'classnames'
import Logo from './Logo'

const NavBar = (props) => {
  const {
    fixed,
    appBaseName,
    title,
    actions
  } = props

  return (
    <div
      className={clx(
        'navbar bg-base-300 w-full top-0 z-10',
        'sticky',
        { fixed }
      )}
    >
      <div className='flex-1'>
        <Logo appBaseName={appBaseName}>
          {title}
        </Logo>
      </div>
      <div className='flex flex-1 justify-end'>
        <div className='flex items-stretch'>
          {actions}
        </div>
      </div>
    </div>
  )
}

export default NavBar
