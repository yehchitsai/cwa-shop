import { Link } from 'react-router-dom'
import Portal from '..'

const PortalWithLinks = (props) => {
  const { links = [] } = props

  return (
    <Portal>
      {links.map((link) => {
        return (
          <Link
            key={link.url}
            to={link.url}
            className='btn btn-outline btn-lg my-2'
          >
            {link.name}
          </Link>
        )
      })}
    </Portal>
  )
}

export default PortalWithLinks
