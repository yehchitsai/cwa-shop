import safeAwait from 'safe-await'
import { get } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import useGet from './useGet'
import useUpdate from './useUpdate'
import useCreate from './useCreate'

const getPreSignedUrlsHost = getApiHost('VITE_AWS_GET_PRE_SIGNED_URLS')
const getS3FinalizeHost = getApiHost('VITE_AWS_S3_FINALIZE')
const getPreSignedUrlsEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/getPreSignedUrls`
const s3FinalizeEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/finalize`

const useUploadS3 = () => {
  const {
    trigger: getPreSignedUrls
  } = useGet(getPreSignedUrlsHost)
  const { trigger: preSignedFile } = useUpdate('s3-signed-url')
  const { trigger: s3Finalize } = useCreate(getS3FinalizeHost)

  const uploadS3 = async (input) => {
    const [preSignedUrlError, preSignedUrlResult] = await safeAwait(getPreSignedUrls({
      url: getPreSignedUrlsEndPoint
    }))
    if (preSignedUrlError) {
      return { error: preSignedUrlError }
    }

    const { fileId, fileKey = '', parts } = preSignedUrlResult
    const { signedUrl } = get(parts, '0', {})
    const [preSignedFileError, preSignedFileResult] = await safeAwait(preSignedFile({
      host: signedUrl,
      singleBody: input.file,
      customHeaders: {
        'content-type': input.file.type
      },
      isJsonBody: false,
      isJsonResponse: false,
      isAuthHeader: false
    }))
    if (preSignedFileError) {
      return { error: preSignedFileError }
    }

    const preSignedFileHeader = get(preSignedFileResult, 'headers')
    const ETag = preSignedFileHeader
      ? preSignedFileHeader.get('ETag')
      : ''
    const [s3FinalizeError] = await safeAwait(s3Finalize({
      url: s3FinalizeEndPoint,
      fileId,
      fileKey,
      parts: [{ ETag, PartNumber: 1 }],
      isJsonResponse: false
    }))
    if (s3FinalizeError) {
      return { error: s3FinalizeError }
    }

    const recognitionFishKey = fileKey.replace('tmp/', '')
    return { result: recognitionFishKey }
  }

  return { uploadS3 }
}

export default useUploadS3
