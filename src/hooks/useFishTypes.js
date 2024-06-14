import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty, keyBy } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const nonAuthHost = getEnvVar('VITE_AWS_NO_AUTH_FISH_TYPE_SHOP_HOST')
const authHost = getEnvVar('VITE_AWS_AUTH_FISH_TYPE_SHOP_HOST')
const awsHostPrefix = getApiPrefix()

const useFishTypes = (lang, isAuthRequired = true) => {
  const host = isAuthRequired ? authHost : nonAuthHost
  const params = { lang }
  const url = isEmpty(lang) ? null : `${awsHostPrefix}/bettafish?${qs.stringify(params)}`
  const {
    data: defaultData = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: true })
  const data = get(defaultData, 'results', defaultData)
  const fishTypes = isEmpty(data) ? [] : data.map((item) => {
    const {
      fishType, fishName, scientificName, fishPrice
    } = item
    return {
      ...item,
      label: `${fishName} (${scientificName}) ${fishPrice}`,
      value: fishType
    }
  })
  const fishTypeMap = keyBy(fishTypes, 'value')
  return {
    data,
    fishTypes,
    fishTypeMap,
    isLoading,
    isError: error
  }
}

export default useFishTypes
