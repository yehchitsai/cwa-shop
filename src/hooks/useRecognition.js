import { useState, useRef } from 'react'
import safeAwait from 'safe-await'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import retry from '../utils/retry'
import getApiPrefix from '../utils/getApiPrefix'
import useOnInit from './useOnInit'
import useGet from './useGet'
import useUploadS3 from './useUploadS3'

const getVideoRecognitionHost = getEnvVar('VITE_AWS_S3_OLD_HOST')
const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const s3Env = {
  getPreSignedUrlsHost: getEnvVar('VITE_AWS_S3_OLD_HOST'),
  getS3FinalizeHost: getEnvVar('VITE_AWS_S3_OLD_HOST'),
  getPreSignedUrlsEndPoint: `${awsHostPrefix}/getPreSignedUrls`,
  s3FinalizeEndPoint: `${awsHostPrefix}/finalize`
}

const retryAction = async (action) => {
  const checker = (result) => {
    const recognitionStatus = get(result, 'status')
    const recognitionResults = get(result, 'results')
    return (
      ['success', 'edit'].includes(recognitionStatus) &&
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
  let isNeedEdit = false
  if (status === 'loading') {
    isLoading = true
  }

  if (status === 'success') {
    isSuccess = true
  }

  if (status === 'fail' || status.startsWith('fail')) {
    isError = true
  }

  if (status === 'edit') {
    isNeedEdit = true
    isError = true
  }

  return {
    isLoading, isSuccess, isError, isNeedEdit
  }
}

const useRecognition = (file, queue, controller, onUpdate) => {
  const isInit = useRef(false)
  const isVideoUploaded = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecognitionError, setIsRecognitionError] = useState(false)
  const [isNoVideo, setIsNoVideo] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [fileKey, setFileKey] = useState(null)
  const [data, setData] = useState({})
  const { uploadS3 } = useUploadS3(queue, controller, s3Env)
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
        setError(uploadS3Error)
        setStatus('fail')
        onUpdate({}, false)
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
      setError(videoRecognitionError)
      setStatus('fail')
      if (videoRecognitionError.message !== 'pending') {
        setIsRecognitionError(true)
      }
      onUpdate({}, false)
      return
    }

    const newData = get(result, 'results', {})
    setIsNoVideo(newData.itemVideo === '')
    if (result.status === 'edit') {
      setIsLoading(false)
      setData(newData)
      setStatus('edit')
      onUpdate(newData, false)
      setIsRecognitionError(true)
      return
    }

    setIsLoading(false)
    setData(newData)
    onUpdate(newData, true)
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
    isRecognitionError,
    isNoVideo,
    error,
    state: getRecognitionState(status),
    data
  }
}

export default useRecognition
