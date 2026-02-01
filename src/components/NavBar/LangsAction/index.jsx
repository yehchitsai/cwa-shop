import { MdGTranslate } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { keyBy } from 'lodash-es'
import useOnInit from '../../../hooks/useOnInit'

const langs = [
  { label: '中文繁體', value: 'zh-TW' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'jp' }
]
const langsMap = keyBy(langs.map((lang) => lang.value))

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

const LangsAction = () => {
  const { i18n } = useTranslation()
  const defaultLang = getSelectLang(i18n)

  useOnInit(() => {
    document.querySelector(`input[type='radio'][value="${defaultLang}"]`).checked = true
  })

  const onChangeLang = (e) => {
    const selectLang = e.target.value
    i18n.changeLanguage(selectLang)
  }

  return (
    <div className='dropdown dropdown-end form-control'>
      <label tabIndex={0} className='btn btn-ghost'>
        <MdGTranslate size='1.5em' />
      </label>
      <ul
        tabIndex={0}
        className='menu dropdown-content z-10 w-36 rounded-box bg-base-100 p-2 shadow'
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
  )
}

export default LangsAction
