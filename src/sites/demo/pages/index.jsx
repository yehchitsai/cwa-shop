import { Link } from 'react-router-dom'
import { flow, keys } from 'lodash-es'
import Portal from '../../../components/Portal'

const links = flow(
  () => keys(import.meta.glob('./**/index.jsx')),
  (paths) => paths.map((path) => {
    return path.replace('../', '/').replace('/index.jsx', '')
  }),
  (endpoints) => endpoints.map((endpoint) => ({
    url: endpoint,
    name: endpoint.replace(/\.\/|\//g, '')
  }))
)()

const Demo = () => {
  return (
    <Portal isFixed>
      {links.map((link) => {
        return (
          <Link
            key={link.url}
            to={link.url}
            className='btn btn-outline btn-lg'
          >
            {link.name}
          </Link>
        )
      })}
    </Portal>
  )
}

export default Demo
