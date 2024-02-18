import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Field, Form } from 'formik'
import { get, isEmpty } from 'lodash-es'
import Modal from '../../../../components/Modal'
import Video from '../../../../components/Video'
import getVideoJsOptions from '../../../../components/Video/getVideoJsOptions'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'

const FORM = {
  ID: 'id',
  FISH_TYPE: 'fishType',
  IMAGES: 'images'
}

const EditModal = (props) => {
  const { modalRef, editItem, onClose } = props
  const [isUpdated, setIsUpdated] = useState(false)
  const dropzoneRef = useRef()
  const { t } = useTranslation()
  const { id, fishType, images = [] } = get(editItem, 'data', {})
  const src = get(editItem, 'item.url')
  const type = get(editItem, 'item.file.type')

  const onOpen = () => {
    setIsUpdated(false)
  }

  useEffect(() => {
    if (isUpdated || isEmpty(images)) {
      return
    }

    dropzoneRef.current.setAcceptedFiles(images)
    setIsUpdated(true)
  }, [setIsUpdated, isUpdated, images])

  return (
    <Modal
      modalRef={modalRef}
      id='editBatchItem'
      title='Edit item'
      className='max-lg:w-[60vw] max-sm:w-[90%] lg:w-[50vw]'
      onOpen={onOpen}
      onClose={onClose}
      isCloseBtnVisible
      isOkBtnVisible
    >
      <FormRow
        label={t('video')}
        className='mb-10 h-[30vh]'
      >
        <Video
          options={getVideoJsOptions({ src, type })}
          height='h-[30vh!important]'
        />
      </FormRow>
      <Formik
        initialValues={{
          [FORM.ID]: id,
          [FORM.FISH_TYPE]: fishType
        }}
      >
        {() => (
          <Form>
            <FormRow label='Id'>
              <Field name={FORM.ID} className='input input-bordered' required />
            </FormRow>
            <FormRow label='FishType'>
              <Field name={FORM.FISH_TYPE} className='input input-bordered' required />
            </FormRow>
            <FormRow
              label={t('pictures')}
            >
              <Dropzone
                dropzoneRef={dropzoneRef}
                name={FORM.IMAGES}
                accept={ACCEPT.IMAGE}
                customPreviewSize='lg:w-1/3'
                // onFinish={onSelectFilesFinish}
                // isShowPreview={false}
                // isSelectFolder
              />
            </FormRow>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default EditModal
