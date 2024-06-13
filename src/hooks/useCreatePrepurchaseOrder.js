import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createPrepurchaseOrderHost = getApiHost('VITE_AWS_CREATE_PREPURCHASE_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createPrepurchaseOrderEndPoint = `${awsHostPrefix}/prepurchaseorder`

const useCreatePrepurchaseOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createPrepurchaseOrderHost)

  const trigger = (body) => {
    return {
      url: createPrepurchaseOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreatePrepurchaseOrder
