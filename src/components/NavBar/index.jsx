import clx from 'classnames'
import { MdGTranslate, MdLogout } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import useOnInit from '../../hooks/useOnInit'

const langs = [
  { label: '中文', value: 'zh-TW' },
  { label: '英文', value: 'en' },
  { label: '日文', value: 'jp' }
]

const HomeLogo = (props) => {
  const { fixed } = props
  const { t } = useTranslation()
  const className = 'btn btn-ghost text-xl normal-case'
  if (fixed) {
    return (
      <span className={className}>
        {`CWA ${t('shop')}`}
      </span>
    )
  }

  return (
    <a
      href={`${window.location.href.replace(window.location.pathname, window.APP_BASENAME)}`}
      className={className}
    >
      {`CWA ${t('shop')}`}
    </a>
  )
}

const Logout = (props) => {
  const { children, fixed } = props
  if (fixed) {
    return (
      <div className='btn btn-ghost'>
        {children}
      </div>
    )
  }

  return (
    <a href='../example' className='btn btn-ghost'>
      {children}
    </a>
  )
}

const NavBar = (props) => {
  const { fixed } = props
  const { t, i18n } = useTranslation()

  const onChangeLang = (e) => {
    const selectLang = e.target.value
    i18n.changeLanguage(selectLang)
  }

  useOnInit(() => {
    document.querySelector(`input[type='radio'][value="${i18n.resolvedLanguage}"]`).checked = true
  })

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
            <ul
              tabIndex={0}
              className='menu dropdown-content rounded-box z-10 mt-4 w-36 translate-y-10 bg-base-100 p-2 shadow'
            >
              {langs.map((lang) => {
                const { value, label } = lang
                return (
                  <li key={value}>
                    <label className='label cursor-pointer'>
                      <input
                        type='radio'
                        name='lang'
                        className='radio'
                        onChange={onChangeLang}
                        value={value}
                      />
                      <span className='label-text'>{label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className='btn btn-ghost'>
            <div
              className='tooltip tooltip-bottom'
              data-tip={`v${window.APP_VERSION}`}
            >
              <span className='max-sm:hidden'>{t('user')}</span>
              <FaUserCircle className='md:hidden' size='1.5em' />
            </div>
          </div>
          <Logout fixed={fixed}>
            <MdLogout size='1.5em' />
          </Logout>
        </div>
      </div>
    </div>
  )
}

export default NavBar
