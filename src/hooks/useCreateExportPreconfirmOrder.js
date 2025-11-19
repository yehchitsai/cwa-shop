import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportPreconfirmOrderHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createExportPreconfirmOrderEndPoint = `${awsHostPrefix}/exportpreconfirmorder`

const useCreateExportPreconfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportPreconfirmOrderHost)

  const trigger = (body) => {
    return originTrigger({
      url: createExportPreconfirmOrderEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportPreconfirmOrder
