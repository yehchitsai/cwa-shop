import ReactDOM from 'react-dom/client'
import { flow, keys, isEmpty } from 'lodash-es'
import Root from '../components/Root'
import PortalWithLinks from '../components/Portal/WithLinks'

const links = flow(
  () => keys(import.meta.glob('./**/index.html')),
  (paths) => paths.filter((path) => {
    return (
      path !== './index.html' &&
      // login 只有在 mock 環境露出
      (window.IS_MOCK ? true : !path.includes('./login'))
    )
  }),
  (filteredPaths) => filteredPaths.map((path) => {
    if (window.APP_BASENAME === '') {
      return path.replace('index.html', '')
    }

    return path.replace('./', '/').replace('index.html', '')
  }),
  (endpoints) => endpoints.map((endpoint) => ({
    url: `${window.APP_BASENAME}${endpoint}`,
    name: endpoint.replace(/\.\/|\//g, '')
  }))
)()

window.sessionStorage.removeItem('redirectPath')

const { pathname, search } = window.location
const targetRouter = links.find((link) => pathname.startsWith(`/${link.name}/`))
if (!isEmpty(targetRouter)) {
  const nextPathName = window.location.href
    .replace(window.location.search, '')
    .replace(pathname, `/${targetRouter.name}/`)
  sessionStorage.setItem('redirectPath', `${pathname}${search}`)
  window.location.href = nextPathName
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root>
    <PortalWithLinks links={links} />
  </Root>
)
