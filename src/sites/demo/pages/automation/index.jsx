import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { MdAdd, MdOutlineMarkEmailUnread } from 'react-icons/md'
import FormLayout from '../../../../components/Form/Layout'
import FormRow from '../../../../components/Form/FormRow'
import FocusError from '../../../../components/Form/FocusError'
import Dropzone from '../../../../components/Dropzone'
import ACCEPT from '../../../../components/Dropzone/accept'

const FORM = {
  VIDEOS: 'videos'
}

const validationSchema = Yup.object().shape({
  [FORM.VIDEOS]: Yup.array().min(1).required('Miss video!')
}, [])

const Automation = () => {
  const { t } = useTranslation()

  // const onSubmit = async (formValues, { setSubmitting }) => {}
  const onSubmit = async () => {}

  return (
    <Formik
      initialValues={{
        [FORM.VIDEOS]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <FormLayout>
            <div role='alert' className='alert'>
              <MdOutlineMarkEmailUnread size='1.5em' />
              <span>
                Only upload large video,
                service will automation generate information and images,
                please check email after success.
              </span>
            </div>
            <FormRow
              label={t('video')}
              error={touched[FORM.VIDEOS] && errors[FORM.VIDEOS]}
            >
              <Dropzone
                name={FORM.VIDEOS}
                accept={ACCEPT.VIDEO}
                // maxSize={100}
                // disabled={isMutating}
              />
            </FormRow>
            <div className='text-right'>
              <button
                type='submit'
                className='btn btn-outline'
                // disabled={isMutating}
              >
                <MdAdd size='1.5em' />
                {t('newItem')}
              </button>
            </div>
            <FocusError />
          </FormLayout>
        </Form>
      )}
    </Formik>
  )
}

export default Automation
