import { useState, useRef } from 'react'
import safeAwait from 'safe-await'
import qs from 'query-string'
import { get } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import retry from '../utils/retry'
import useOnInit from './useOnInit'
import useUpdate from './useUpdate'
import useGet from './useGet'

const putVideHost = getApiHost('VITE_AWS_PUT_VIDEO')
const getVideoRecognitionHost = getApiHost('VITE_AWS_GET_VIDEO_RECOGNITION')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX

const retryAction = async (action) => {
  const checker = (result) => {
    const recognitionStatus = get(result, 'status')
    return recognitionStatus === 'success'
  }

  const retryTimes = window.IS_MOCK ? 1 : 3
  return retry('recognition failed')(action, checker, retryTimes)
}

const getRecognitionState = (status) => {
  let isLoading = false
  let isSuccess = false
  let isError = false
  if (status === 'loading') {
    isLoading = true
  }

  if (status === 'success') {
    isSuccess = true
  }

  if (status === 'fail') {
    isError = true
  }

  return { isLoading, isSuccess, isError }
}

const useRecognition = (file, onSuccess) => {
  const isInit = useRef(false)
  const isVideoUploaded = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [recognitionError, setRecognitionError] = useState(null)
  const [status, setStatus] = useState('')
  const [data, setData] = useState({})
  const { name: fileName, url } = file
  const {
    trigger: uploadVideo
  } = useUpdate(putVideHost)
  const {
    trigger: getVideoRecognition
  } = useGet(getVideoRecognitionHost)

  const recognition = async () => {
    setIsLoading(true)
    setStatus('loading')
    // prevent reupload video
    if (!isVideoUploaded.current) {
      const [uploadVideoError] = await safeAwait(
        uploadVideo({ url: `/v1/ithomebucket/${fileName}`, File: url })
      )
      if (uploadVideoError) {
        setIsLoading(false)
        setRecognitionError(uploadVideoError)
        setStatus('fail')
        return
      }
    }

    isVideoUploaded.current = true
    const params = { file: fileName }
    const getRecognitionUrl = `${awsHostPrefix}/getRecognition?${qs.stringify(params)}`
    const [videoRecognitionError, result] = await safeAwait(
      retryAction(() => getVideoRecognition({ url: getRecognitionUrl }))
    )
    if (videoRecognitionError) {
      setIsLoading(false)
      setRecognitionError(videoRecognitionError)
      setStatus('fail')
      return
    }

    setIsLoading(false)
    const newData = get(result, 'results', {})
    setData(newData)
    onSuccess(newData)
    setStatus('success')
  }

  useOnInit(() => {
    if (isInit.current) {
      return
    }

    const trigger = () => recognition()
    trigger()
    isInit.current = true
  })

  return {
    trigger: recognition,
    isLoading,
    error: recognitionError,
    state: getRecognitionState(status),
    data
  }
}

export default useRecognition
