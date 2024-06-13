import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createConfirmOrderHost = getApiHost('VITE_AWS_CREATE_CONFIRM_ORDER_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createConfirmOrderEndPoint = `${awsHostPrefix}/confirmorder`

const useCreateConfirmOrder = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createConfirmOrderHost)

  const trigger = (body) => {
    return {
      url: createConfirmOrderEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateConfirmOrder
