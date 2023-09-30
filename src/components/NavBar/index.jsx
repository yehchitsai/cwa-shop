import { Link } from 'react-router-dom'
import clx from 'classnames'
import { MdGTranslate, MdLogout } from 'react-icons/md'

const HomeLogo = (props) => {
  const { fixed } = props
  const className = 'btn btn-ghost text-xl normal-case'
  if (fixed) {
    return (
      <span className={className}>
        CWA SHOP
      </span>
    )
  }

  return (
    <Link
      to='/'
      className={className}
    >
      CWA SHOP
    </Link>
  )
}

const NavBar = (props) => {
  const { fixed } = props
  return (
    <div
      className={clx(
        'navbar bg-base-300 w-full',
        { fixed }
      )}
    >
      <div className='flex-1'>
        <HomeLogo fixed={fixed} />
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <details>
              <summary>
                <MdGTranslate size='1.5em' />
              </summary>
              <ul className='bg-base-300 p-2'>
                <li className='w-16'><span>中文</span></li>
                <li><span>英文</span></li>
                <li><span>日文</span></li>
              </ul>
            </details>
          </li>
          <li><span>Admin</span></li>
          <li><span><MdLogout size='1.5em' /></span></li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
