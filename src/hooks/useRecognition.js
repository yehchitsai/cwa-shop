import { useState, useRef } from 'react'
import safeAwait from 'safe-await'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import retry from '../utils/retry'
import useOnInit from './useOnInit'
import useGet from './useGet'
import useUploadS3 from './useUploadS3'

const getVideoRecognitionHost = getApiHost('VITE_AWS_GET_VIDEO_RECOGNITION')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX

const retryAction = async (action) => {
  const checker = (result) => {
    const recognitionStatus = get(result, 'status')
    const recognitionResults = get(result, 'results')
    return (
      recognitionStatus === 'success' &&
      !isEmpty(recognitionResults)
    )
  }

  const retryTimes = window.IS_MOCK ? 1 : 10
  const getMessage = ({ error, result }) => {
    const status = get(result, 'status')
    const errorMessage = get(error, 'message')
    return status || errorMessage
  }
  return retry(getMessage)(action, checker, retryTimes)
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

const useRecognition = (file, queue, controller, onSuccess) => {
  const isInit = useRef(false)
  const isVideoUploaded = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [recognitionError, setRecognitionError] = useState(null)
  const [status, setStatus] = useState('')
  const [fileKey, setFileKey] = useState(null)
  const [data, setData] = useState({})
  const { uploadS3 } = useUploadS3(queue, controller)
  const {
    trigger: getVideoRecognition
  } = useGet(getVideoRecognitionHost)

  const recognition = async () => {
    setIsLoading(true)
    setStatus('loading')
    let videoFileKey = fileKey
    if (!isVideoUploaded.current) {
      const { error: uploadS3Error, result: newFileKey } = await uploadS3(file)
      if (uploadS3Error) {
        setIsLoading(false)
        setRecognitionError(uploadS3Error)
        setStatus('fail')
        return
      }

      setFileKey(newFileKey)
      videoFileKey = newFileKey
    }

    isVideoUploaded.current = true
    const params = { fileKey: videoFileKey }
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
