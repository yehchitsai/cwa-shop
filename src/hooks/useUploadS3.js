import safeAwait from 'safe-await'
import {
  get, size
} from 'lodash-es'
import qs from 'query-string'
import useGet from './useGet'
import useUpdate from './useUpdate'
import useCreate from './useCreate'

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

const abortedError = new Error('aborted upload')

const useUploadS3 = (queue, controller, s3Env) => {
  const {
    getPreSignedUrlsHost,
    getS3FinalizeHost,
    getPreSignedUrlsEndPoint,
    s3FinalizeEndPoint
  } = s3Env
  const {
    trigger: getPreSignedUrls
  } = useGet(getPreSignedUrlsHost)
  const { trigger: preSignedFile } = useUpdate('s3-signed-url', { method: 'putForm' })
  const { trigger: s3Finalize } = useCreate(getS3FinalizeHost)

  const uploadS3 = async (input) => {
    const chunkFiles = getChunkFilesByMB(input.file, CHUNK_MB_SIZE)
    const chunkFileSize = size(chunkFiles)
    const preSignedUrlsRequest = () => {
      if (controller.signal.aborted) {
        throw abortedError
      }

      return getPreSignedUrls({
        url: `${getPreSignedUrlsEndPoint}?${qs.stringify({
          parts: chunkFileSize,
          file_name: input.name
        })}`
      })
    }
    const [preSignedUrlError, preSignedUrlResult] = await safeAwait(
      queue.add(preSignedUrlsRequest, { priority: 1 })
    )
    if (preSignedUrlError) {
      const error = new Error(`preSigned error: ${preSignedUrlError.message}`)
      return { error }
    }

    const { fileId, fileKey = '', parts } = preSignedUrlResult
    const tasks = parts.map((part, index) => {
      return () => {
        const chunkFile = get(chunkFiles, index)
        const formData = new FormData()
        formData.append('file', chunkFile)
        if (controller.signal.aborted) {
          throw new Error('aborted upload')
        }

        return preSignedFile({
          host: get(part, 'signedUrl'),
          body: get(chunkFiles, index),
          customHeaders: {
            'Content-Type': input.file.type
          },
          isJsonResponse: false,
          isAuthHeader: false
        })
      }
    })
    const [preSignedFileError, preSignedFileResults] = await safeAwait(
      queue.addAll(tasks)
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
    const finalizeRequest = () => {
      if (controller.signal.aborted) {
        throw abortedError
      }

      return s3Finalize({
        url: s3FinalizeEndPoint,
        body: {
          fileId,
          fileKey,
          parts: finalizeParts
        },
        isJsonResponse: false
      })
    }
    const [s3FinalizeError] = await safeAwait(
      queue.add(finalizeRequest, { priority: 1 })
    )
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
