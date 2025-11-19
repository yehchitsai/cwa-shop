import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const awsHostPrefix = getApiPrefix()
const endpoint = `${awsHostPrefix}/recoveredata`

const useCreateRecoverData = () => {
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

export default useCreateRecoverData
