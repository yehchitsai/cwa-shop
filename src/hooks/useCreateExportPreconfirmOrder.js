import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportPreconfirmOrderHost = getApiHost('VITE_AWS_CREATE_EXPORT_PRECONFIRM_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createExportPreconfirmOrderEndPoint = `${awsHostPrefix}/exportpreconfirmorder`

const useCreateExportPreconfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportPreconfirmOrderHost)

  const trigger = (body) => {
    return {
      url: createExportPreconfirmOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportPreconfirmOrder
