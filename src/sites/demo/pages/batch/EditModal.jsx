import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Field, Form } from 'formik'
import clx from 'classnames'
import {
  flow, get, isEmpty, isNull, map, pick
} from 'lodash-es'
import * as Yup from 'yup'
import useFishTypes from '../../../../hooks/useFishTypes'
import Modal from '../../../../components/Modal'
import Video from '../../../../components/Video'
import getVideoJsOptions from '../../../../components/Video/getVideoJsOptions'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'
import { FORM_ITEM } from './constants'

const id = 'editBatchItem'

const FORM = {
  ITEM_SERIAL: 'itemSerial',
  FISH_TYPE: 'fishType',
  ITEM_IMAGES: 'itemImages',
  ITEM_VIDEO: 'itemVideo'
}

const validationSchema = Yup.object().shape({
  [FORM.ITEM_SERIAL]: Yup.string().required(`Miss ${FORM.ITEM_SERIAL}!`),
  [FORM.FISH_TYPE]: Yup.string().required(`Miss ${FORM.FISH_TYPE}!`),
  [FORM.ITEM_IMAGES]: Yup.array()
})

const EditModal = (props) => {
  const {
    modalRef, editItem, onClose, onUpdated
  } = props
  const [isUpdated, setIsUpdated] = useState(false)
  const dropzoneRef = useRef()
  const { t, i18n } = useTranslation()
  const { fishTypes, isLoading } = useFishTypes(i18n.language, false)
  const initFormData = get(editItem, 'data', {})
  const {
    itemSerial,
    fishType = -1,
    itemImages = [],
    itemVideo = ''
  } = initFormData

  const onEditModalOpen = () => {
    setIsUpdated(false)
  }

  const onEditModalClose = () => {
    setIsUpdated(false)
    onClose && onClose()
  }

  const onEditModalOk = (formValues) => {
    const errorElement = document.querySelector(`#${id} .text-red-400:not(:empty)`)
    console.log(errorElement)
    if (!isNull(errorElement)) {
      errorElement.scrollIntoView({ behavior: 'smooth' })
      return
    }

    const convertedItemImages = flow(
      () => get(formValues, FORM.ITEM_IMAGES, []),
      (newItemImages) => map(newItemImages, 'url')
    )()
    const updateFormValues = {
      ...pick(formValues, [FORM.FISH_TYPE, FORM.ITEM_SERIAL, FORM.ITEM_VIDEO]),
      [FORM.ITEM_IMAGES]: convertedItemImages
    }
    onUpdated(`${editItem.field}.${FORM_ITEM.RECOGNITION_DATA}`, updateFormValues)
    modalRef.current.close()
  }

  useEffect(() => {
    if (isUpdated || isEmpty(itemImages) || !dropzoneRef.current) {
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
      id={id}
      title='Edit item'
      className='max-lg:w-[60vw] max-sm:w-[90%] lg:w-[50vw]'
      onOpen={onEditModalOpen}
      onClose={onEditModalClose}
      isCloseBtnVisible
      isOkBtnVisible
      isFormModal
    >
      {(actions) => (
        <>
          <FormRow
            label={t('video')}
          >
            <Video
              options={getVideoJsOptions({
                src: itemVideo
              })}
              height='h-[30vh!important]'
            />
          </FormRow>
          <Formik
            initialValues={{
              [FORM.ITEM_SERIAL]: itemSerial,
              [FORM.FISH_TYPE]: fishType,
              [FORM.ITEM_IMAGES]: itemImages,
              [FORM.ITEM_VIDEO]: itemVideo
            }}
            onSubmit={onEditModalOk}
            validationSchema={validationSchema}
          >
            {(formProps) => (
              <Form>
                <FormRow
                  label={FORM.ITEM_SERIAL}
                  error={formProps.touched[FORM.ITEM_SERIAL] && formProps.errors[FORM.ITEM_SERIAL]}
                >
                  <Field
                    name={FORM.ITEM_SERIAL}
                    className='input input-bordered'
                    autoComplete='off'
                  />
                </FormRow>
                <FormRow
                  label={FORM.FISH_TYPE}
                  error={formProps.touched[FORM.FISH_TYPE] && formProps.errors[FORM.FISH_TYPE]}
                >
                  <Field
                    as='select'
                    name={FORM.FISH_TYPE}
                    className={clx(
                      'select select-bordered w-full lg:max-w-xs'
                    )}
                    disabled={isLoading}
                  >
                    <option value={-1} disabled>Select fish type</option>
                    {fishTypes.map((type) => {
                      const { label, value } = type
                      return (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      )
                    })}
                  </Field>
                </FormRow>
                <FormRow
                  label={FORM.ITEM_IMAGES}
                  error={formProps.errors[FORM.ITEM_IMAGES]}
                >
                  <Dropzone
                    dropzoneRef={dropzoneRef}
                    name={FORM.ITEM_IMAGES}
                    accept={ACCEPT.IMAGE}
                    customPreviewSize='lg:w-1/3'
                  />
                </FormRow>
                {actions}
              </Form>
            )}
          </Formik>
        </>
      )}
    </Modal>
  )
}

export default EditModal
