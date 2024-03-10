import safeAwait from 'safe-await'
import {
  get, size
} from 'lodash-es'
import qs from 'query-string'
import axios from 'axios'
import getApiHost from '../utils/getApiHost'
import useGet from './useGet'
import useCreate from './useCreate'

const getPreSignedUrlsHost = getApiHost('VITE_AWS_GET_PRE_SIGNED_URLS')
const getS3FinalizeHost = getApiHost('VITE_AWS_S3_FINALIZE')
const getPreSignedUrlsEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/getPreSignedUrls`
const s3FinalizeEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/finalize`

const CHUNK_MB_SIZE = 10

const getBytesFromMB = (megabytes) => {
  const bytes = megabytes * 1024 * 1024
  return bytes
}

const getChunkFilesByMB = (file, megabytes) => {
  const bytesFromMB = getBytesFromMB(megabytes)
  const chunkFiles = []
  let start = 0
  while (start < file.size) {
    chunkFiles.push(file.slice(start, start + bytesFromMB))
    start += bytesFromMB
  }
  return chunkFiles
}

const useUploadS3 = () => {
  const {
    trigger: getPreSignedUrls
  } = useGet(getPreSignedUrlsHost)
  const { trigger: s3Finalize } = useCreate(getS3FinalizeHost)

  const uploadS3 = async (input) => {
    const chunkFiles = getChunkFilesByMB(input.file, CHUNK_MB_SIZE)
    const chunkFileSize = size(chunkFiles)
    const [preSignedUrlError, preSignedUrlResult] = await safeAwait(getPreSignedUrls({
      url: `${getPreSignedUrlsEndPoint}?${qs.stringify({ parts: chunkFileSize })}`
    }))
    if (preSignedUrlError) {
      const error = new Error(`preSigned error: ${preSignedUrlError.message}`)
      return { error }
    }

    const { fileId, fileKey = '', parts } = preSignedUrlResult
    const [preSignedFileError, preSignedFileResults] = await safeAwait(
      Promise.all(parts.map(async (part, index) => {
        return axios.put(
          get(part, 'signedUrl'),
          get(chunkFiles, index),
          {
            headers: { 'content-type': input.file.type }
          }
        )
      }))
    )
    if (preSignedFileError) {
      const error = new Error(`preSignedFile error: ${preSignedFileError.message}`)
      return { error }
    }

    const finalizeParts = preSignedFileResults.map((preSignedFileResult, index) => {
      const headers = get(preSignedFileResult, 'headers')
      return {
        PartNumber: index + 1,
        ETag: headers ? headers.get('ETag') : ''
      }
    })
    const [s3FinalizeError] = await safeAwait(s3Finalize({
      url: s3FinalizeEndPoint,
      fileId,
      fileKey,
      parts: finalizeParts,
      isJsonResponse: false
    }))
    if (s3FinalizeError) {
      const error = new Error(`finalize error: ${s3FinalizeError.message}`)
      return { error }
    }

    const recognitionFishKey = fileKey.replace('tmp/', '')
    return { result: recognitionFishKey }
  }

  return { uploadS3 }
}

export default useUploadS3
