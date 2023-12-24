import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdOutlineCloudUpload, MdDelete, MdError } from 'react-icons/md'
import clx from 'classnames'
import {
  flow, get, isEmpty, keyBy, reduce, size
} from 'lodash-es'
import { Field, useFormikContext } from 'formik'
import { filesize as getFileSize } from 'filesize'

// default max 4 MB
const DEFAULT_MAX_SIZE = 4

const Dropzone = (props) => {
  const {
    className, accept, name, disabled, maxSize = DEFAULT_MAX_SIZE
  } = props
  const { values, setFieldValue } = useFormikContext()
  const rejectField = `${name}Error`
  const files = get(values, name, [])
  const rejections = get(values, rejectField, [])

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (isEmpty(acceptedFiles)) {
      setFieldValue(rejectField, fileRejections)
      return
    }

    const rejectionsBySize = flow(
      () => reduce(acceptedFiles, (collect, acceptedFile) => {
        const {
          value: fileSize,
          unit
        } = getFileSize(acceptedFile.size, { exponent: 2, output: 'object', standard: 'jedec' })
        if (fileSize > maxSize) {
          collect.push([acceptedFile, `${fileSize}${unit}`])
        }
        return collect
      }, []),
      (rejectedFiles) => rejectedFiles.map(([rejectedFile, fileSize]) => ({
        file: rejectedFile,
        rejectFileSize: fileSize,
        errors: [{ code: -1, message: `File size exceed limit ${maxSize} MB` }]
      }))
    )()

    const newFiles = []
    const filesWithoutExceedLimit = flow(
      () => keyBy(rejectionsBySize, 'file.path'),
      (rejectedMapByFilePath) => acceptedFiles.filter((acceptedFile) => {
        return !(acceptedFile.path in rejectedMapByFilePath)
      })
    )()
    for (const acceptedFile of filesWithoutExceedLimit) {
      const { name: fileName, type } = acceptedFile
      const isVideo = type === 'video/mp4'
      const commonInfo = { isVideo, name: fileName, file: acceptedFile }
      const newFile = new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(acceptedFile)
        reader.onloadend = () => {
          const { result } = reader
          resolve({ url: result, ...commonInfo })
        }
      })
      newFiles.push(newFile)
    }
    const { vaildFiles, rejectFileByBase64Size } = reduce(
      await Promise.all(newFiles),
      (collect, newFile) => {
        const { url, file } = newFile
        const {
          value: fileSize,
          unit
        } = getFileSize(size(url), { exponent: 2, output: 'object', standard: 'jedec' })
        const isExceedLimit = fileSize > maxSize
        if (isExceedLimit) {
          collect.rejectFileByBase64Size.push({
            file,
            rejectFileSize: `${fileSize} ${unit}`,
            errors: [{ code: -1, message: `File size exceed limit ${maxSize} MB` }]
          })
          return collect
        }

        collect.vaildFiles.push(newFile)
        return collect
      },
      { vaildFiles: [], rejectFileByBase64Size: [] }
    )
    const allFiles = [...files, ...vaildFiles]
    setFieldValue(rejectField, [
      ...fileRejections,
      ...rejectionsBySize,
      ...rejectFileByBase64Size
    ])
    setFieldValue(name, allFiles)
  }, [files, rejectField, name, maxSize, setFieldValue])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({
    onDrop, accept, noClick: true, disabled
  })

  const onRemoveFile = (targetIndex) => () => {
    const newFiles = files.filter((file, index) => index !== targetIndex)
    setFieldValue(name, newFiles)
  }

  return (
    <>
      <div
        {
          ...getRootProps({
            className: clx('m-full', { [className]: className })
          })
        }
      >
        <label className={clx(
          'flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none',
          { 'border-gray-400': isDragActive }
        )}
        >
          <span className='flex items-center space-x-2'>
            <MdOutlineCloudUpload
              className='text-gray-600 max-sm:h-16 max-sm:w-16 sm:h-8 sm:w-8'
            />
            <span className='font-medium text-gray-600'>
              {
                isDragActive
                  ? <p>Drop the files here ...</p>
                  : (
                    <p>
                      Drag and drop some files here, or
                      <button
                        type='button'
                        onClick={open}
                        className='btn btn-outline mx-4'
                        disabled={disabled}
                      >
                        click
                      </button>
                      to select files
                    </p>
                  )
              }
            </span>
          </span>
          <input {...getInputProps()} />
        </label>
      </div>
      {!isEmpty(rejections) && (
        <div className='alert alert-error my-4 flex flex-wrap'>
          <div className='flex'>
            <MdError size='1.5em' className='mr-2' />
            <span className='flex'>{' Some files get rejected'}</span>
          </div>
          <br />
          <div className='flex w-full'>
            <ol>
              {rejections.map((rejection) => {
                const { file, rejectFileSize, errors = [] } = rejection
                const { code } = get(errors, '0', {})
                const isExceedLimit = (code === -1)
                console.log(errors)
                return (
                  <div
                    key={file.path}
                    className='collapse'
                  >
                    <input type='checkbox' name={file.path} checked readOnly />
                    <div className='collapse-title min-h-0 text-xl font-medium'>
                      {isExceedLimit ? `${file.path} - ${rejectFileSize}` : file.path}
                    </div>
                    <div className='collapse-content'>
                      <ul>
                        {errors.map((e, index) => (
                          <li key={index}>{e.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </ol>
          </div>
        </div>
      )}
      <div className='m-auto flex w-full flex-wrap'>
        {files.map((file, index) => {
          const { url, isVideo } = file
          return (
            <div
              className={clx(
                'relative',
                { 'p-2 max-sm:w-1/2 max-lg:w-1/3 lg:w-1/6': !isVideo },
                { 'w-full flex justify-evenly bg-black my-4': isVideo }
              )}
              key={index}
            >
              {
                !isVideo && (
                  <img
                    className='mask mask-square h-full rounded-md'
                    src={url}
                    alt='upload file'
                  />
                )
              }
              {
                isVideo && (
                  <video
                    key={url}
                    src={url}
                    controls
                  />
                )
              }
              <button
                type='button'
                className='btn btn-square btn-error btn-outline btn-sm absolute bottom-4 right-4'
                onClick={onRemoveFile(index)}
                disabled={disabled}
              >
                <MdDelete
                  size='1.2em'
                />
              </button>
            </div>
          )
        })}
      </div>
      <Field
        name={name}
        className='hidden'
      />
    </>
  )
}

export default Dropzone
