import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_GET_EXPORT_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const useExportCategoryInfo = (category) => {
  const params = { category }
  const qsStr = isEmpty(category) ? '' : `?${qs.stringify(params)}`
  const url = `${awsHostPrefix}/exportcategoryinfo${qsStr}`
  const {
    data: defaultData = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useExportCategoryInfo
