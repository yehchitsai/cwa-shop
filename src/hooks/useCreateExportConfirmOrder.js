import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportConfirmOrderHost = getApiHost('VITE_AWS_CREATE_EXPORT_CONFIRM_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
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
