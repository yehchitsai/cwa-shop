import { useRef, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import { format } from 'date-fns'
import { MdAdd, MdError } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  get,
  isEmpty,
  isUndefined,
  keyBy,
  size
} from 'lodash-es'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'
import useCreate from '../../../../hooks/useCreate'
import getEnvVar from '../../../../utils/getEnvVar'
import getApiPrefix from '../../../../utils/getApiPrefix'
import getFormValues from '../../../../utils/getFormValues'
import useUploadS3 from '../../../../hooks/useUploadS3'
import useQueue from '../../../../hooks/useQueue'

const FORM = {
  DATE: 'delivery_date',
  EXCEL: 'excel',
  ASSETS: 'assets'
}

const today = new Date()

const uploadExcelHost = getEnvVar('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const uploadExcelEndPoint = `${awsHostPrefix}/uploadquotation`

const s3Env = {
  getPreSignedUrlsHost: getEnvVar('VITE_AWS_GET_PRE_SIGNED_URLS_PURCHASE_HOST'),
  getS3FinalizeHost: getEnvVar('VITE_AWS_S3_FINALIZE_PURCHASE_HOST'),
  getPreSignedUrlsEndPoint: `${awsHostPrefix}/presignedurls`,
  s3FinalizeEndPoint: `${awsHostPrefix}/uploadfinalize`
}

const validationSchema = Yup.object().shape({
  [FORM.EXCEL]: Yup.array().required('Miss excel!')
})

const Quotation = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const dropzoneRef = useRef()
  const [isAssetsUploaded, setIsAssetsUploaded] = useState(true)
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const [uploadedAssets, setUploadedAssets] = useState([])
  const { queue, controller } = useQueue()
  const { uploadS3 } = useUploadS3(queue, controller, s3Env)
  const {
    trigger,
    isMutating
  } = useCreate(uploadExcelHost)

  const onDropAssets = async (assetFiles) => {
    const uploadedMap = keyBy(uploadedAssets, 'name')
    const acceptFiles = assetFiles.filter((file) => {
      return (
        isUndefined(get(file, 'code')) &&
        !(file.name in uploadedMap)
      )
    })
    const isUnacceptFilesExist = (
      size(assetFiles) !== size(acceptFiles) ||
      isEmpty(acceptFiles)
    )
    if (isUnacceptFilesExist) {
      return
    }
    setUploadedAssets([...uploadedAssets, ...acceptFiles])

    const toastId = toast.loading('Uploading...')
    setIsAssetsUploaded(false)
    const [uploadS3Error] = await safeAwait(
      Promise.all(
        acceptFiles.map((file) => {
          return uploadS3(file).then((result) => {
            const { error } = result
            if (error) {
              throw error
            }

            return result
          })
        })
      )
    )
    if (uploadS3Error) {
      toast.error(`Error! ${uploadS3Error.message}`, { id: toastId })
      return
    }

    toast.success('Finish!', { id: toastId })
    setIsAssetsUploaded(true)
  }

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
  }

  const clearForm = () => {
    resetBtn.current.click()
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    console.log(formValues)
    const convertedFormValues = getFormValues(formValues, [FORM.EXCEL])
    const postParams = {
      url: uploadExcelEndPoint,
      body: {
        delivery_date: get(formValues, FORM.DATE),
        file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
      }
    }
    const toastId = toast.loading('Uploading...')
    const [createError] = await safeAwait(trigger(postParams))
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    clearForm()
  }

  return (
    <Formik
      initialValues={{
        [FORM.DATE]: format(today, 'yyyy-MM-dd'),
        [FORM.EXCEL]: undefined
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <div role='alert' className='alert flex text-left'>
              <MdError size='1.5em' />
              <span>先把圖片與影片上傳完成後再上傳 Excel</span>
            </div>
            <FormRow
              label='上傳壓縮檔 (圖片與影片)'
              error={touched[FORM.ASSETS] && errors[FORM.ASSETS]}
            >
              <Dropzone
                dropzoneRef={dropzoneRef}
                name={FORM.ASSETS}
                accept={ACCEPT.COMPRESSED}
                onStart={() => setIsAssetsUploaded(false)}
                onFinish={onDropAssets}
                maxSize={Infinity}
                isShowPreview={false}
              />
            </FormRow>
            <FormRow
              label='預計出貨日期'
              required
            >
              <Field
                type='date'
                name={FORM.DATE}
                className='input input-bordered w-full lg:max-w-xs'
                autoComplete='off'
                disabled={isMutating || !isAssetsUploaded}
              />
            </FormRow>
            <FormRow
              label='上傳 Excel(.xlsx)'
              error={touched[FORM.EXCEL] && errors[FORM.EXCEL]}
              required
            >
              <Dropzone
                name={FORM.EXCEL}
                accept={ACCEPT.EXCEL}
                disabled={isMutating || !isAssetsUploaded || isExcelUploaded}
                onFinish={onDropExcels}
                isShowPreview={false}
              />
              {isExcelUploaded && (
                <div className='alert alert-success my-4 flex flex-wrap'>
                  {`按${t('newItem')}上傳 Excel`}
                </div>
              )}
            </FormRow>
            <div className='text-right'>
              <button
                ref={resetBtn}
                type='reset'
                className='hidden'
              >
                reset
              </button>
              <button
                type='submit'
                className='btn btn-outline'
                disabled={isMutating || !isAssetsUploaded}
              >
                <MdAdd size='1.5em' />
                {`${t('newItem')}`}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default Quotation
