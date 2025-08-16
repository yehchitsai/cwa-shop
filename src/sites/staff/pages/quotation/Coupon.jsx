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

const FORM = {
  EXCEL: 'excel'
}

const uploadExcelHost = getEnvVar('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
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
  const {
    trigger,
    isMutating
  } = useCreate(uploadExcelHost)

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
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
        [FORM.EXCEL]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <div role='alert' className='alert flex text-left'>
              <MdError size='1.5em' />
              <span>優惠方案</span>
            </div>
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
        </Form>
      )}
    </Formik>
  )
}

export default Coupon
