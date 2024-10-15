import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createPrepurchaseOrderHost = getEnvVar('VITE_AWS_CREATE_PREPURCHASE_ORDER_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createPrepurchaseOrderEndPoint = `${awsHostPrefix}/prepurchaseorder`

const useCreatePrepurchaseOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createPrepurchaseOrderHost)

  const trigger = (body) => {
    return {
      url: createPrepurchaseOrderEndPoint,
      body
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreatePrepurchaseOrder
