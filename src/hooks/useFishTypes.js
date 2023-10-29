import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty, keyBy } from 'lodash-es'
import getApiHost from '../utils/getApiHost'

const host = getApiHost('VITE_AWS_DYNAMIC_HOST1')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX

const useFishTypes = (lang) => {
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
