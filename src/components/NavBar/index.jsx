import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import clx from 'classnames'
import { MdGTranslate, MdLogout } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { keyBy } from 'lodash-es'
import useOnInit from '../../hooks/useOnInit'

const logoutUrl = import.meta.env.VITE_LOGOUT_URL
const langs = [
  { label: '中文繁體', value: 'zh-TW' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'jp' }
]
const langsMap = keyBy(langs.map((lang) => lang.value))

const HomeLogo = (props) => {
  const { appBaseName } = props
  const { t } = useTranslation()
  const className = 'btn btn-ghost text-xl normal-case'

  return (
    <a
      href={`${window.location.origin}${appBaseName}`}
      className={className}
    >
      {`${t('shop')}`}
    </a>
  )
}

const Logout = (props) => {
  const { children, appBaseName } = props

  return (
    <a
      href={window.IS_MOCK ? `${window.location.origin}${appBaseName}/login` : logoutUrl}
      className='btn btn-ghost'
    >
      {children}
    </a>
  )
}

const User = () => {
  const data = useLoaderData()
  return (
    <Suspense fallback={<span>Loading</span>}>
      <Await
        resolve={data.message}
        errorElement={<span>Error</span>}
      >
        {(message) => message}
      </Await>
    </Suspense>
  )
}

const getSelectLang = (i18n) => {
  const systemLangsMap = keyBy(i18n.languages)
  const currentLang = i18n.language
  const preferLang = i18n.resolvedLanguage
  const isCurrentLangInSystem = currentLang in systemLangsMap
  const isCurrentLangInOptions = currentLang in langsMap
  const isPerferLangInOptions = preferLang in langsMap
  if (isCurrentLangInSystem && isCurrentLangInOptions) {
    return currentLang
  }

  if (isPerferLangInOptions) {
    return preferLang
  }

  return 'en'
}

const NavBar = (props) => {
  const { fixed, appBaseName } = props
  const { i18n } = useTranslation()
  const defaultLang = getSelectLang(i18n)

  const onChangeLang = (e) => {
    const selectLang = e.target.value
    i18n.changeLanguage(selectLang)
  }

  useOnInit(() => {
    document.querySelector(`input[type='radio'][value="${defaultLang}"]`).checked = true
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
        <HomeLogo appBaseName={appBaseName} />
      </div>
      <div className='flex flex-1 justify-end'>
        <div className='flex items-stretch'>
          <div className='dropdown dropdown-end form-control'>
            <label tabIndex={0} className='btn btn-ghost'>
              <MdGTranslate size='1.5em' />
            </label>
            <ul
              tabIndex={0}
              className='menu dropdown-content z-10 mt-4 w-36 translate-y-10 rounded-box bg-base-100 p-2 shadow'
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
              <span className='max-sm:hidden'>
                {fixed ? <FaUserCircle size='1.5em' /> : <User />}
              </span>
              <FaUserCircle className='md:hidden' size='1.5em' />
            </div>
          </div>
          <Logout appBaseName={appBaseName}>
            <MdLogout size='1.5em' />
          </Logout>
        </div>
      </div>
    </div>
  )
}

export default NavBar
