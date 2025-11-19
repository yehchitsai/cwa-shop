import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createExportPrepurchaseOrderHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createExportPrepurchaseOrderEndPoint = `${awsHostPrefix}/exportprepurchaseorder`

const useCreateExportPrepurchaseOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createExportPrepurchaseOrderHost)

  const trigger = (body) => {
    return originTrigger({
      url: createExportPrepurchaseOrderEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateExportPrepurchaseOrder
