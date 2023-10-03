import { Link } from 'react-router-dom'
import clx from 'classnames'
import { MdGTranslate, MdLogout } from 'react-icons/md'

const langs = [
  { label: '中文', value: 'ch' },
  { label: '英文', value: 'en' },
  { label: '日文', value: 'jp' }
]

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
        'navbar bg-base-300 w-full top-0 z-10',
        'sticky',
        { fixed }
      )}
    >
      <div className='flex-1'>
        <HomeLogo fixed={fixed} />
      </div>
      <div className='flex flex-1 justify-end'>
        <div className='flex items-stretch'>
          <div className='dropdown dropdown-end form-control'>
            <label tabIndex={0} className='btn btn-ghost'>
              <MdGTranslate size='1.5em' />
            </label>
            <ul tabIndex={0} className='menu dropdown-content rounded-box z-[1] mt-4 w-36 bg-base-100 p-2 shadow'>
              {langs.map((lang) => (
                <li key={lang.value}>
                  <label className='label cursor-pointer'>
                    <input type='radio' name='lang' className='radio' />
                    <span className='label-text'>{lang.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className='btn btn-ghost'>
            <span className='tooltip tooltip-bottom' data-tip={`v${window.APP_VERSION}`}>
              User 1
            </span>
          </div>
          <span className='btn btn-ghost'>
            <MdLogout size='1.5em' />
          </span>
        </div>
      </div>
    </div>
  )
}

export default NavBar
