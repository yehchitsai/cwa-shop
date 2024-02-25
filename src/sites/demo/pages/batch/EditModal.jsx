import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Field, Form } from 'formik'
import {
  first, get, isEmpty, map
} from 'lodash-es'
import Modal from '../../../../components/Modal'
import Video from '../../../../components/Video'
import getVideoJsOptions from '../../../../components/Video/getVideoJsOptions'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'

const FORM = {
  ITEM_SERIAL: 'itemSerial',
  FISH_TYPE: 'fishType',
  IMAGES: 'images'
}

const EditModal = (props) => {
  const { modalRef, editItem, onClose } = props
  const [isUpdated, setIsUpdated] = useState(false)
  const dropzoneRef = useRef()
  const { t } = useTranslation()
  const {
    itemSerial,
    fishType,
    itemImages = [],
    itemVideos = []
  } = get(editItem, 'data', {})

  const onOpen = () => {
    setIsUpdated(false)
  }

  useEffect(() => {
    if (isUpdated || isEmpty(itemImages)) {
      return
    }

    const acceptFiles = map(itemImages, (itemImage) => ({
      isVideo: false,
      url: itemImage
    }))
    dropzoneRef.current.setAcceptedFiles(acceptFiles)
    setIsUpdated(true)
  }, [setIsUpdated, isUpdated, itemImages])

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
      >
        <Video
          options={getVideoJsOptions({ src: first(itemVideos) })}
          height='h-[30vh!important]'
        />
      </FormRow>
      <Formik
        initialValues={{
          [FORM.ITEM_SERIAL]: itemSerial,
          [FORM.FISH_TYPE]: fishType,
          [FORM.IMAGES]: itemImages
        }}
      >
        {() => (
          <Form>
            <FormRow label='Id'>
              <Field name={FORM.ITEM_SERIAL} className='input input-bordered' required />
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
