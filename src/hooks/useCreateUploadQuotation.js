import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createUploadQuotationHost = getApiHost('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const createUploadQuotationEndPoint = `${awsHostPrefix}/uploadquotation`

const useCreateUploadQuotation = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createUploadQuotationHost)

  const trigger = (body) => {
    return {
      url: createUploadQuotationEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateUploadQuotation
