import { useRef, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import { MdAdd } from 'react-icons/md'
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

const REPORT_TYPE = {
  UPLOAD_DEMAND_REPORT: 'uploaddemandreport',
  UPLOAD_PURCHASE_ORDER: 'uploadpurchaseorder',
  UPLOAD_SHIPPING_ORDER: 'uploadshippingorder'
}

const REPORT_TYPE_MAP = {
  [REPORT_TYPE.UPLOAD_DEMAND_REPORT]: '需求彙整單 (零售商)',
  [REPORT_TYPE.UPLOAD_PURCHASE_ORDER]: '最終需求彙整單 (供應商-採購單)',
  [REPORT_TYPE.UPLOAD_SHIPPING_ORDER]: '包裝彙整單 (零售商-出貨單)'
}

const REPORT_TYPE_OPTIONS = [
  REPORT_TYPE.UPLOAD_DEMAND_REPORT,
  REPORT_TYPE.UPLOAD_PURCHASE_ORDER,
  REPORT_TYPE.UPLOAD_SHIPPING_ORDER
].map((type) => ({ label: REPORT_TYPE_MAP[type], value: type }))

const FORM = {
  REPORT_TYPE: 'reportType',
  EXCEL: 'excel'
}

const uploadExcelHost = getEnvVar('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const demandreportEndPoint = `${awsHostPrefix}/demandreport`
const uploadExcelEndPoint = {
  [REPORT_TYPE.UPLOAD_DEMAND_REPORT]: `${awsHostPrefix}/uploaddemandreport`,
  [REPORT_TYPE.UPLOAD_PURCHASE_ORDER]: `${awsHostPrefix}/uploadpurchaseorder`,
  [REPORT_TYPE.UPLOAD_SHIPPING_ORDER]: `${awsHostPrefix}/uploadshippingorder`
}

const validationSchema = Yup.object().shape({
  [FORM.REPORT_TYPE]: Yup.string().required('Miss report type!'),
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const Page = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiResult, setApiResult] = useState({})
  const {
    trigger,
    isMutating
  } = useCreate(uploadExcelHost)
  const isLoading = isMutating

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
    setApiResult({})
  }

  const clearForm = () => {
    setIsExcelUploaded(false)
    resetBtn.current.click()
  }

  const onSubmitDemandReport = async () => {
    setApiResult({})
    const postParams = {
      url: demandreportEndPoint,
      body: {}
    }
    const toastId = toast.loading('Generate report...')
    setIsGenerating(true)
    const [createError, result] = await safeAwait(trigger(postParams))
    setIsGenerating(false)
    clearForm()
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      return
    }

    setApiResult(result)
    toast.success('Finish!', { id: toastId })
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    console.log(formValues)
    const convertedFormValues = getFormValues(formValues, [FORM.EXCEL])
    const reportType = formValues[FORM.REPORT_TYPE]
    const endPointByReportType = uploadExcelEndPoint[reportType]
    if (isEmpty(endPointByReportType)) {
      toast.error('Miss report type')
      return
    }

    const postParams = {
      url: endPointByReportType,
      body: {
        file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
      }
    }
    const toastId = toast.loading('Uploading...')
    const [createError, result] = await safeAwait(trigger(postParams))
    clearForm()
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    setApiResult(result)
    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    setIsExcelUploaded(false)
  }

  return (
    <Formik
      initialValues={{
        [FORM.REPORT_TYPE]: REPORT_TYPE.UPLOAD_DEMAND_REPORT,
        [FORM.EXCEL]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='m-auto flex w-full flex-col gap-4 max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='md:flex-1'>
                <div>
                  <button
                    type='button'
                    onClick={onSubmitDemandReport}
                    className='btn btn-outline'
                    disabled={isGenerating || isLoading}
                  >
                    生成彙整單
                  </button>
                </div>
                <div className='divider' />
                <FormRow
                  label='類型'
                  required
                >
                  <Field
                    as='select'
                    name={FORM.REPORT_TYPE}
                    className='select select-bordered w-full lg:max-w-xs'
                    autoComplete='off'
                    disabled={isLoading}
                  >
                    {REPORT_TYPE_OPTIONS.map(({ value, label }) => {
                      return (
                        <option
                          value={value}
                          key={value}
                        >
                          {label}
                        </option>
                      )
                    })}
                  </Field>
                </FormRow>
                <FormRow
                  label='上傳 Excel(.xlsx)'
                  error={touched[FORM.EXCEL] && errors[FORM.EXCEL]}
                  required
                >
                  <Dropzone
                    name={FORM.EXCEL}
                    accept={ACCEPT.EXCEL}
                    disabled={isLoading || isExcelUploaded}
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
                    disabled={isLoading}
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

export default Page
