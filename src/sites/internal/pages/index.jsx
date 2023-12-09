import { useMemo, useRef } from 'react'
import {
  concat, get, isEmpty, pick
} from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { MdAdd } from 'react-icons/md'
import clx from 'classnames'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import getFormValues from '../../../utils/getFormValues'
import getApiHost from '../../../utils/getApiHost'
import useFishTypes from '../../../hooks/useFishTypes'
import useCreate from '../../../hooks/useCreate'
import Dropzone from '../../../components/Dropzone'
import ACCEPT from '../../../components/Dropzone/accept'
import FormRow from '../../../components/Form/FormRow'
import FocusError from '../../../components/Form/FocusError'

const putImageHost = getApiHost('VITE_AWS_PUT_IMAGE_HOST')
const putImageEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/putimage`

const FORM = {
  TYPE: 'fishType',
  ITEM_SERIAL: 'itemSerial',
  IMAGES: 'images',
  VIDEOS: 'videos'
}
const ACTION = {
  NEW: 'new',
  UPDATE: 'update'
}

const validationSchema = Yup.object().shape({
  [FORM.TYPE]: Yup.string().required('Miss type!'),
  [FORM.ITEM_SERIAL]: Yup.string().required('Miss itemSerial!'),
  [FORM.IMAGES]: Yup.array().when(FORM.VIDEOS, {
    is: isEmpty,
    then: () => Yup.array().min(1, 'images or videos field can\'t be empty'),
    otherwise: () => Yup.array()
  }),
  [FORM.VIDEOS]: Yup.array().when(FORM.IMAGES, {
    is: isEmpty,
    then: () => Yup.array().min(1, 'videos or images field can\'t be empty'),
    otherwise: () => Yup.array()
  })
}, [FORM.IMAGES, FORM.VIDEOS])

const Product = () => {
  const { t, i18n } = useTranslation()
  const { fishTypes } = useFishTypes(i18n.language, false)
  const {
    trigger: createFishData,
    isMutating: isMutatingNewFishData
  } = useCreate(putImageHost)
  const {
    trigger: updateFishData,
    isMutating: isMutatingUpdatedFishData
  } = useCreate(putImageHost)
  const fishType = useMemo(
    () => get(fishTypes, '0.value'),
    [fishTypes]
  )
  const resetBtn = useRef()
  const isMutating = (isMutatingNewFishData || isMutatingUpdatedFishData)

  const clearForm = () => {
    resetBtn.current.click()
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    const convertedFormValues = getFormValues(formValues, [FORM.IMAGES, FORM.VIDEOS])
    console.log({ formValues, convertedFormValues })
    const assets = concat(
      get(convertedFormValues, FORM.IMAGES).map((data) => ({ data, type: FORM.IMAGES })),
      get(convertedFormValues, FORM.VIDEOS).map((data) => ({ data, type: FORM.VIDEOS }))
    )
    const paramsList = assets.map((asset, index) => {
      const action = index === 0 ? ACTION.NEW : ACTION.UPDATE
      const params = {
        url: putImageEndPoint,
        ...pick(convertedFormValues, [FORM.TYPE, FORM.ITEM_SERIAL]),
        fileName: asset.data,
        action
      }
      return params
    })
    const [newParams, ...updateParamsList] = paramsList
    const toastId = toast.loading('Creating...')
    const [createError] = await safeAwait(createFishData(newParams))
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    const [updateError] = await safeAwait(
      Promise.all(updateParamsList.map(updateFishData))
    )
    if (updateError) {
      toast.error(`Error! ${updateError.message}`, { id: toastId })
      setSubmitting(false)
    }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    clearForm()
  }

  return (
    <Formik
      initialValues={{
        [FORM.TYPE]: fishType,
        [FORM.ITEM_SERIAL]: '',
        [FORM.IMAGES]: [],
        [FORM.VIDEOS]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
            <FormRow
              label={`${t('fishType')}`}
              error={touched[FORM.TYPE] && errors[FORM.TYPE]}
              required
            >
              <Field
                as='select'
                name={FORM.TYPE}
                className={clx(
                  'select select-bordered w-full lg:max-w-xs'
                )}
                disabled={isMutating}
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
              label={`${t('tankNo')}`}
              error={touched[FORM.ITEM_SERIAL] && errors[FORM.ITEM_SERIAL]}
              required
            >
              <Field
                type='text'
                name={FORM.ITEM_SERIAL}
                placeholder='Type here'
                className='input input-bordered w-full lg:max-w-xs'
                autoComplete='off'
                disabled={isMutating}
              />
            </FormRow>
            <FormRow
              label={`${t('pictures')}`}
              error={touched[FORM.IMAGES] && errors[FORM.IMAGES]}
            >
              <Dropzone
                name={FORM.IMAGES}
                accept={ACCEPT.IMAGE}
                disabled={isMutating}
              />
            </FormRow>
            <FormRow
              label={`${t('video')}`}
              error={touched[FORM.VIDEOS] && errors[FORM.VIDEOS]}
            >
              <Dropzone
                name={FORM.VIDEOS}
                accept={ACCEPT.VIDEO}
                disabled={isMutating}
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
                disabled={isMutating}
              >
                <MdAdd size='1.5em' />
                {`${t('newItem')}`}
              </button>
            </div>
          </div>
          <FocusError />
        </Form>
      )}
    </Formik>
  )
}

export default Product
