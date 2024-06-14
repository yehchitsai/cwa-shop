import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createPreconfirmOrderHost = getEnvVar('VITE_AWS_CREATE_PRECONFIRM_ORDER_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createPreconfirmOrderEndPoint = `${awsHostPrefix}/preconfirmorder`

const useCreatePreconfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createPreconfirmOrderHost)

  const trigger = (body) => {
    return {
      url: createPreconfirmOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreatePreconfirmOrder
