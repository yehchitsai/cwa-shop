import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createPreconfirmOrderHost = getApiHost('VITE_AWS_CREATE_PRECONFIRM_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createPreconfirmOrderEndPoint = `${awsHostPrefix}/preconfirmorder`

const useCreatePreconfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createPreconfirmOrderHost)

  const trigger = (body) => {
    return {
      url: createPreconfirmOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreatePreconfirmOrder
