import Portal from '..'

const PortalWithLinks = (props) => {
  const { links = [] } = props
  return (
    <Portal>
      {links.map((link) => {
        return (
          <a
            key={link.url}
            href={link.url}
            className='btn btn-outline btn-lg'
          >
            {link.name}
          </a>
        )
      })}
    </Portal>
  )
}

export default PortalWithLinks
