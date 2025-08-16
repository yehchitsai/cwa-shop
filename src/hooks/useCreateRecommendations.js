import { get } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createRecommendationsEndPoint = `${awsHostPrefix}/recommendations`

const useCreateRecommendations = () => {
  const {
    trigger: originTrigger, isError, data, ...rest
  } = useCreate(host)

  const trigger = (body) => {
    return originTrigger({
      url: createRecommendationsEndPoint,
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
