import useSWRMutation from 'swr/mutation'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'

const host = getApiHost('VITE_AWS_FISH_PREORDER_SHOP_HOST')
const awsHostPrefix = getApiPrefix()

const useFishPreorder = (itemSerial) => {
  const params = { itemSerial }
  const url = isEmpty(itemSerial) ? null : `${awsHostPrefix}/bettafishpreorder?${qs.stringify(params)}`
  const {
    data: defaultData = [], error, isLoading, isMutating, trigger
  } = useSWRMutation(() => ({ url, host }), { keepPreviousData: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading,
    isMutating,
    isError: error,
    trigger
  }
}

export default useFishPreorder
