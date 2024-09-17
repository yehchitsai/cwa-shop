import { useRef } from 'react'
import { Formik, Field, Form } from 'formik'
import { add, format } from 'date-fns'
import { MdAdd } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
// import { get, isEmpty, isUndefined } from 'lodash-es'
import toast from 'react-hot-toast'
// import safeAwait from 'safe-await'
import FormRow from '../../../../components/Form/FormRow'
// import useCreate from '../../../../hooks/useCreate'
// import getEnvVar from '../../../../utils/getEnvVar'
// import getApiPrefix from '../../../../utils/getApiPrefix'

const FORM = {
  START: 'start',
  END: 'end'
}

const today = new Date()

// const uploadExcelHost = getEnvVar('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
// const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
// const awsHostPrefix = getApiPrefix(subPrefix)
// const uploadExcelEndPoint = `${awsHostPrefix}/uploadquotation`

const DemandOrder = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  // const {
  //   trigger,
  //   isMutating
  // } = useCreate(uploadExcelHost)

  const clearForm = () => {
    resetBtn.current.click()
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    console.log(formValues)
    // const postParams = {
    //   url: uploadExcelEndPoint,
    //   body: {
    //     delivery_date: get(formValues, FORM.DATE),
    //     file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
    //   }
    // }
    const toastId = toast.loading('Uploading...')
    // const [createError] = await safeAwait(trigger(postParams))
    // if (createError) {
    //   toast.error(`Error! ${createError.message}`, { id: toastId })
    //   setSubmitting(false)
    // }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    clearForm()
  }

  return (
    <Formik
      initialValues={{
        [FORM.START]: format(add(today, { days: -7 }), 'yyyy-MM-dd'),
        [FORM.END]: format(today, 'yyyy-MM-dd')
      }}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <FormRow
              label='開始日期'
              required
            >
              <Field
                type='date'
                name={FORM.START}
                className='input input-bordered w-full lg:max-w-xs'
                autoComplete='off'
                // disabled={isMutating}
              />
            </FormRow>
            <FormRow
              label='截止日期'
              required
            >
              <Field
                type='date'
                name={FORM.END}
                className='input input-bordered w-full lg:max-w-xs'
                autoComplete='off'
                // disabled={isMutating}
              />
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
                // disabled={isMutating}
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

export default DemandOrder
