import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportConfirmOrderHost = getEnvVar('VITE_AWS_CREATE_EXPORT_CONFIRM_ORDER_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createExportConfirmOrderEndPoint = `${awsHostPrefix}/exportconfirmorder`

const useCreateExportConfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportConfirmOrderHost)

  const trigger = (body) => {
    return {
      url: createExportConfirmOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportConfirmOrder
