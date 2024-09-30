import { useCallback, useState, useImperativeHandle } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdOutlineCloudUpload, MdDelete, MdError } from 'react-icons/md'
import clx from 'classnames'
import {
  filter,
  flow, get, isEmpty, keyBy, reduce, size
} from 'lodash-es'
import { Field, useFormikContext } from 'formik'
import { filesize as getFileSize } from 'filesize'
import Video from '../Video'
import getVideoJsOptions from '../Video/getVideoJsOptions'

// default max 5.6 MB
const DEFAULT_MAX_SIZE = 5.6

const SELECT_TYPE_OPTIONS = [
  { value: true, label: 'Select by files' },
  { value: false, label: 'Select by folder' }
]

const Dropzone = (props) => {
  const {
    className,
    accept = {},
    name,
    disabled,
    dropzoneRef,
    maxSize = DEFAULT_MAX_SIZE,
    customPreviewSize,
    isSelectFolder = false,
    isShowPreview = true,
    onStart = () => {},
    onFinish = () => {}
  } = props
  const [isPending, setIsPending] = useState(false)
  const [selectType, setSelectType] = useState(true)
  const { values, setFieldValue } = useFormikContext()
  const rejectField = `${name}Error`
  const files = get(values, name, [])
  const rejections = get(values, rejectField, [])

  const onSelectType = (e) => {
    const newSelectType = JSON.parse(get(e, 'target.value', true))
    setSelectType(newSelectType)
  }

  const onDrop = useCallback(async (defaultAcceptedFiles, defaultFileRejections) => {
    onStart()
    setIsPending(true)
    const acceptFilesMap = keyBy(files, 'name')
    const acceptedFiles = filter(defaultAcceptedFiles, (acceptedFile) => {
      return !(acceptedFile.name in acceptFilesMap)
    })
    const fileRejections = isSelectFolder
      // select folder will ignore unaccept type file
      ? filter(defaultFileRejections, (rejection) => {
        const fileName = get(rejection, 'file.name')
        return (
          (rejection.file.type in accept) &&
          !fileName.startsWith('.') &&
          !(fileName in acceptFilesMap)
        )
      })
      : defaultFileRejections

    if (isEmpty(acceptedFiles)) {
      setFieldValue(rejectField, fileRejections)
      setIsPending(false)
      onFinish(files)
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
      const { name: fileName, type = '' } = acceptedFile
      const isVideo = type.startsWith('video/')
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
    setIsPending(false)
    onFinish(allFiles)
  }, [files, rejectField, name, maxSize, accept, isSelectFolder, setFieldValue, onFinish, onStart])

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop, accept, noClick: true, disabled: (disabled || isPending)
  })

  const onRemoveFile = (targetIndex) => () => {
    const newFiles = files.filter((file, index) => index !== targetIndex)
    setFieldValue(name, newFiles)
  }

  const onRemoveFileByFileName = (fileName) => {
    const newFiles = files.filter((file) => file.name !== fileName)
    setFieldValue(name, newFiles)
  }

  const open = () => {
    const { ref } = getInputProps()
    ref.current.click()
  }

  useImperativeHandle(dropzoneRef, () => {
    return {
      removeFile: (index) => onRemoveFile(index)(),
      removeFileByFileName: (fileName) => onRemoveFileByFileName(fileName),
      setAcceptedFiles: (defaultFiles) => setFieldValue(name, defaultFiles),
      getAcceptedFiles: () => files
    }
  })

  return (
    <>
      {
        isSelectFolder && (
          <div className='w-full'>
            {SELECT_TYPE_OPTIONS.map((option, index) => (
              <label className='label cursor-pointer' key={index}>
                <input
                  type='radio'
                  name='select-type'
                  className='radio'
                  value={option.value}
                  checked={option.value === selectType}
                  onChange={onSelectType}
                  disabled={isPending}
                />
                <span className='label-text w-full pl-4'>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )
      }
      <div
        {
          ...getRootProps({
            className: clx('w-full', { [className]: className })
          })
        }
      >
        <label className={clx(
          'flex justify-center w-full h-32 px-4 transition bg-base-100 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none',
          { 'border-gray-400': isDragActive }
        )}
        >
          <span className='flex items-center space-x-2'>
            <MdOutlineCloudUpload
              className='text-gray-600 max-sm:size-16 sm:size-8'
            />
            <span className='font-medium text-gray-600'>
              {
                isDragActive && (
                  <p>
                    {`Drop the ${selectType ? 'files' : 'folder'} here ...`}
                  </p>
                )
              }
              {
                !isDragActive && (
                  <p>
                    Drag and drop
                    {` ${selectType ? 'some files' : 'folder'} `}
                    here, or
                    <button
                      type='button'
                      onClick={open}
                      className='btn btn-outline mx-4'
                      disabled={disabled}
                    >
                      click
                    </button>
                    {'to select '}
                    {selectType ? 'files' : 'folder'}
                  </p>
                )
              }
            </span>
          </span>
          {selectType && (
            <input {...getInputProps()} />
          )}
          {!selectType && (
            <input
              {...getInputProps({ webkitdirectory: '', directory: '' })}
            />
          )}
        </label>
      </div>
      {!isEmpty(rejections) && (
        <div className='alert alert-error my-4 flex flex-wrap'>
          <div className='flex w-full justify-between'>
            <div className='flex'>
              <MdError size='1.5em' className='mr-2' />
              <span>{' Some files get rejected'}</span>
            </div>
            <div className='justify-end'>aaa</div>
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
                    className='collapse text-left'
                  >
                    <input type='checkbox' name={file.path} checked readOnly />
                    <div className='collapse-title min-h-0 text-xl font-medium'>
                      {isExceedLimit ? `${file.path} - ${rejectFileSize}` : file.path}
                    </div>
                    <div className='collapse-content break-all'>
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
      {isShowPreview && (
        <div className='m-auto flex w-full flex-wrap'>
          {files.map((file, index) => {
            const { url, isVideo } = file
            return (
              <div
                className={clx(
                  'relative',
                  { 'p-2 max-sm:w-1/2': !isVideo },
                  { 'max-lg:w-1/3 lg:w-1/6': (!isVideo && !customPreviewSize) },
                  { [customPreviewSize]: (!isVideo && customPreviewSize) },
                  { 'w-full bg-black my-4': isVideo }
                )}
                key={index}
              >
                {
                  !isVideo && (
                    <img
                      className='rounded-md object-contain'
                      src={url}
                      alt='upload file'
                    />
                  )
                }
                {
                  isVideo && (
                    <Video
                      options={getVideoJsOptions({ src: url })}
                      height='h-[50vh!important]'
                    />
                  )
                }
                <button
                  type='button'
                  className={clx(
                    'btn btn-square btn-outline btn-error btn-sm absolute bottom-4 right-4 z-[1]'
                  )}
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
      )}
      <Field
        name={name}
        className='hidden'
      />
    </>
  )
}

export default Dropzone
