import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const endpoint = `${awsHostPrefix}/systemstate`

const useCreateSystemState = () => {
  const { trigger: originTrigger, ...rest } = useCreate(host, { isOriginData: true })

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

export default useCreateSystemState
