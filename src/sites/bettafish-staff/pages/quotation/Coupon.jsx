import { useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import { MdAdd, MdError } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  get,
  isEmpty,
  isUndefined
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
import safeJSON from '../../../../utils/safeJSON'

const FORM = {
  EXCEL: 'excel'
}

const uploadExcelHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const uploadExcelEndPoint = `${awsHostPrefix}/uploaddiscountplan`

const validationSchema = Yup.object().shape({
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const Coupon = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const [apiResult, setApiResult] = useState({})
  const {
    trigger,
    isMutating
  } = useCreate(uploadExcelHost)

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
    setApiResult({})
  }

  const clearForm = () => {
    resetBtn.current.click()
    setIsExcelUploaded(false)
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    console.log(formValues)
    const convertedFormValues = getFormValues(formValues, [FORM.EXCEL])
    const postParams = {
      url: uploadExcelEndPoint,
      body: {
        file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
      }
    }
    const toastId = toast.loading('Uploading...')
    const [createError, result] = await safeAwait(trigger(postParams))
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    clearForm()
    setApiResult(result)
  }

  return (
    <Formik
      initialValues={{
        [FORM.EXCEL]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='m-auto flex w-full flex-col gap-4 max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <div role='alert' className='alert flex text-left'>
              <MdError size='1.5em' />
              <span>優惠方案</span>
            </div>
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='md:flex-1'>
                <FormRow
                  label='上傳 Excel(.xlsx)'
                  error={touched[FORM.EXCEL] && errors[FORM.EXCEL]}
                  required
                >
                  <Dropzone
                    name={FORM.EXCEL}
                    accept={ACCEPT.EXCEL}
                    disabled={isMutating || isExcelUploaded}
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
                    disabled={isMutating}
                  >
                    <MdAdd size='1.5em' />
                    {`${t('newItem')}`}
                  </button>
                </div>
              </div>
              <div className='alert flex w-full flex-col items-start gap-4 md:w-1/3'>
                <div>
                  API response
                </div>
                <div>
                  <pre className='whitespace-break-spaces break-all text-left'>
                    {safeJSON(apiResult)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default Coupon
