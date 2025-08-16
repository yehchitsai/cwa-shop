import { get } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useNewCreate from './useNewCreate'

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const url = `${awsHostPrefix}/recommendations`

const useCreateRecommendations = () => {
  const {
    trigger: originTrigger, isError, data, ...rest
  } = useNewCreate(host, url)

  const trigger = (body) => {
    return originTrigger({
      body
    })
  }

  return {
    ...rest,
    data,
    isError: isError || (get(data, 'success') === false),
    trigger
  }
}

export default useCreateRecommendations
