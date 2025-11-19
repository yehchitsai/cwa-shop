import { useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import { MdInfo } from 'react-icons/md'
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

const FORM = {
  EXCEL: 'excel'
}

const uploadExcelHost = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const endPoint = `${awsHostPrefix}/demandreport`

const validationSchema = Yup.object().shape({
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const UploadNewFish = () => {
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
    const convertedFormValues = getFormValues(formValues, [FORM.EXCEL])

    const postParams = {
      url: endPoint,
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
              先上傳新購進魚的excel匯總信息
            </span>
          </div>
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
          <div className='flex justify-end'>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              確認
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default UploadNewFish
