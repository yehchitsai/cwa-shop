import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdOutlineCloudUpload, MdDelete, MdError } from 'react-icons/md'
import clx from 'classnames'
import { isEmpty } from 'lodash-es'

const Dropzone = (props) => {
  const { className, accept, name } = props
  const [files, setFiles] = useState([])
  const [rejections, setRejections] = useState([])

  const setFilesToInput = useCallback((newFiles) => {
    const fileDataList = newFiles.map((newFile) => newFile.url)
    document.querySelector(`[name=${name}]`).value = JSON.stringify(fileDataList)
  }, [name])

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setRejections(fileRejections)
    const newFiles = []
    for (const acceptedFile of acceptedFiles) {
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
    const allFiles = [...files, ...await Promise.all(newFiles)]
    setFiles(allFiles)
    if (isEmpty(acceptedFiles)) {
      return
    }

    setFilesToInput(allFiles)
  }, [files, setFilesToInput])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({ onDrop, accept, noClick: true })

  const onRemoveFile = (targetIndex) => () => {
    const newFiles = files.filter((file, index) => index !== targetIndex)
    setFiles(newFiles)
    setFilesToInput(newFiles)
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
            <MdError size='1.5em' />
            <span className='flex'>{' Some files get rejected'}</span>
          </div>
          <br />
          <div className='flex w-full'>
            {rejections.map((rejection) => {
              const { file, errors } = rejection
              return (
                <li key={file.path}>
                  {`${file.path} - ${file.size} bytes`}
                  <ul>
                    {errors.map((e) => (
                      <li key={e.code}>{e.message}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
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
                    className='mask mask-square rounded-md'
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
              >
                <MdDelete
                  size='1.2em'
                />
              </button>
            </div>
          )
        })}
      </div>
      <input
        name={name}
        className='hidden'
      />
    </>
  )
}

export default Dropzone
