import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const awsHostPrefix = getApiPrefix()
const endpoint = `${awsHostPrefix}/uploadtankinfo`

const useCreateUploadTankInfo = () => {
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

export default useCreateUploadTankInfo
