import { get } from 'lodash-es'
import { atom, useAtom } from 'jotai'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useNewCreate from './useNewCreate'

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const url = `${awsHostPrefix}/recommendations`

const isLoadingAtom = atom(false)

const useCreateRecommendations = () => {
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const {
    trigger: originTrigger, isMutating, isError, data, ...rest
  } = useNewCreate(host, url)

  const trigger = async (body) => {
    setIsLoading(true)
    const result = await originTrigger({
      body
    }).catch((e) => {
      setIsLoading(false)
      throw e
    })
    setIsLoading(false)
    return result
  }

  return {
    ...rest,
    data,
    isMutating: isMutating || isLoading,
    isError: isError || (get(data, 'success') === false),
    trigger
  }
}

export default useCreateRecommendations
