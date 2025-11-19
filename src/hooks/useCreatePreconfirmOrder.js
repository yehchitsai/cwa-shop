import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createPreconfirmOrderHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createPreconfirmOrderEndPoint = `${awsHostPrefix}/preconfirmorder`

const useCreatePreconfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createPreconfirmOrderHost)

  const trigger = (body) => {
    return originTrigger({
      url: createPreconfirmOrderEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreatePreconfirmOrder
