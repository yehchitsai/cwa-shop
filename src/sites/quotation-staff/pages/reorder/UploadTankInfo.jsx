import { useRef, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import { MdInfo } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'
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
import useJsonBlock from '../../../../components/JsonBlock/useJsonBlock'

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
// const demandreportEndPoint = `${awsHostPrefix}/demandreport`
const uploadExcelEndPoint = {
  [REPORT_TYPE.UPLOAD_DEMAND_REPORT]: `${awsHostPrefix}/uploaddemandreport`,
  [REPORT_TYPE.UPLOAD_PURCHASE_ORDER]: `${awsHostPrefix}/uploadpurchaseorder`,
  [REPORT_TYPE.UPLOAD_SHIPPING_ORDER]: `${awsHostPrefix}/uploadshippingorder`
}

const validationSchema = Yup.object().shape({
  [FORM.REPORT_TYPE]: Yup.string().required('Miss report type!'),
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const UploadTankInfo = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  // const [isGenerating, setIsGenerating] = useState(false)
  const [, setJsonBlock] = useJsonBlock()
  const {
    trigger,
    isMutating
  } = useCreate(uploadExcelHost)
  const isLoading = isMutating

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
    setJsonBlock({})
  }

  const clearForm = () => {
    setIsExcelUploaded(false)
    resetBtn.current.click()
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

    setJsonBlock(result)
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
          <div role='alert' className='alert'>
            <MdInfo size='1.5em' />
            <span>
              上傳系統排好的櫃位excel
            </span>
          </div>
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
          <div className='flex justify-end gap-2'>
            <button
              ref={resetBtn}
              type='reset'
              className='hidden'
            >
              reset
            </button>
            <div className='dropdown dropdown-top dropdown-hover'>
              <div tabIndex={0} role='button' className='btn btn-outline'>
                Recover
              </div>
              <ul
                tabIndex={-1}
                className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow'
              >
                <li><span>Item 1</span></li>
                <li><span>Item 2</span></li>
              </ul>
            </div>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              關閉服務
            </button>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              開啟服務
            </button>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              <FaPlus />
              New item
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default UploadTankInfo
