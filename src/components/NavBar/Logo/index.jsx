const Logo = (props) => {
  const { appBaseName, children } = props

  return (
    <a
      href={`${window.location.origin}${appBaseName}`}
      className='btn btn-ghost text-xl normal-case'
    >
      {children}
    </a>
  )
}

export default Logo
