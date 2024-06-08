import { useTranslation } from 'react-i18next'

const Logo = (props) => {
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

export default Logo
