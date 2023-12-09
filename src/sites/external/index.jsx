import ReactDOM from 'react-dom/client'
import {
  concat, filter, flow, get, isEmpty, keyBy, keys, map, values
} from 'lodash-es'
import safeAwait from 'safe-await'
import getApiHost from '../../utils/getApiHost'
import fetcher from '../../utils/fetcher'
import Router from '../../components/Router'
import getRoutes from '../../components/Router/getRoutes'
import Root from '../../components/Root'

const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX
const preorderHost = getApiHost('VITE_AWS_FISH_PREORDER')
const preorderConfig = {
  host: preorderHost,
  url: `${awsHostPrefix}/bettafishpreorder`
}
const fishDataHost = getApiHost('VITE_AWS_FISH_INFO_HOST')
const getFishDataConfig = (fishType) => ({
  host: fishDataHost,
  url: `${awsHostPrefix}/bettafishinfo?fishType=${fishType}`
})

const pages = import.meta.glob('./pages/**/index.jsx')
const tmpSelectedFishData = {}
const dynamicRoutes = getRoutes(pages, async () => {
  const { pathname } = window.location
  const tmpData = get(tmpSelectedFishData, pathname)
  if (!isEmpty(tmpData)) {
    return tmpData
  }

  const [preOrderError, preOrderResp] = await safeAwait(fetcher(preorderConfig))
  if (preOrderError) {
    console.log(preOrderError)
    return []
  }

  const preOrder = get(preOrderResp, 'results', {})
  const preOrderItemSerialMap = flow(
    () => values(preOrder),
    (preOrderValues) => map(preOrderValues, (item) => get(item, 'items', [])),
    (itemsList) => concat(...itemsList),
    (totalItemSerial) => keyBy(totalItemSerial)
  )()
  const [fishDataError, fishDataList] = await safeAwait(Promise.all(
    keys(preOrder)
      .map((fishType) => {
        return fetcher(getFishDataConfig(fishType))
          .then((fishDataResp) => {
            return get(fishDataResp, 'results', []).map((result) => ({ ...result, fishType }))
          })
      })
  ))
  if (fishDataError) {
    console.log(fishDataError)
    return []
  }

  const fishData = concat(...fishDataList)
  const selectedFishData = filter(fishData, (item) => item.itemSerial in preOrderItemSerialMap)
  tmpSelectedFishData[pathname] = selectedFishData
  return selectedFishData
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root>
    <Router
      routes={dynamicRoutes}
      basename='/external'
      isAuthRoutes
    />
  </Root>
)
