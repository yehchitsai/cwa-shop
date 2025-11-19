import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createConfirmOrderHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createConfirmOrderEndPoint = `${awsHostPrefix}/confirmorder`

const useCreateConfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createConfirmOrderHost)

  const trigger = (body) => {
    return originTrigger({
      url: createConfirmOrderEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateConfirmOrder
