import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const endpoint = `${awsHostPrefix}/uploadnewfish`

const useCreateUploadNewFish = () => {
  const { trigger: originTrigger, ...rest } = useCreate(host)

  const trigger = (body) => {
    return originTrigger({
      url: endpoint,
      body
    })
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateUploadNewFish
