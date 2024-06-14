import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportPrepurchaseOrderHost = getEnvVar('VITE_AWS_CREATE_EXPORT_PREPURCHASE_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createExportPrepurchaseOrderEndPoint = `${awsHostPrefix}/exportprepurchaseorder`

const useCreateExportPrepurchaseOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportPrepurchaseOrderHost)

  const trigger = (body) => {
    return {
      url: createExportPrepurchaseOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportPrepurchaseOrder
