import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createUploadQuotationHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createUploadQuotationEndPoint = `${awsHostPrefix}/uploadquotation`

const useCreateUploadQuotation = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createUploadQuotationHost)

  const trigger = (body) => {
    return originTrigger({
      url: createUploadQuotationEndPoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateUploadQuotation
