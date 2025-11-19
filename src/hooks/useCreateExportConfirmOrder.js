import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportConfirmOrderHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createExportConfirmOrderEndPoint = `${awsHostPrefix}/exportconfirmorder`

const useCreateExportConfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportConfirmOrderHost)

  const trigger = (body) => {
    return originTrigger({
      url: createExportConfirmOrderEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportConfirmOrder
