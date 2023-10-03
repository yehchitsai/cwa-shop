import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import clx from 'classnames'
import { MdGTranslate, MdLogout } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

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
    <Link
      to='/'
      className={className}
    >
      {`CWA ${t('shop')}`}
    </Link>
  )
}

const NavBar = (props) => {
  const { fixed } = props
  const { t, i18n } = useTranslation()

  const onChangeLang = (e) => {
    const selectLang = e.target.value
    i18n.changeLanguage(selectLang)
  }

  useEffect(() => {
    document.querySelector(`input[type='radio'][value="${i18n.language}"]`).checked = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <span className='tooltip tooltip-bottom' data-tip={`v${window.APP_VERSION}`}>
              {t('user')}
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
