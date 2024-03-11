import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import safeAwait from 'safe-await'
import * as Yup from 'yup'
import { GrMultiple } from 'react-icons/gr'
import {
  MdAdd, MdWarning, MdChecklist, MdOutlineRefresh
} from 'react-icons/md'
import toast from 'react-hot-toast'
import {
  filter, get, groupBy, isEmpty, isUndefined, map, size
} from 'lodash-es'
import wait from '../../../../utils/wait'
import getApiHost from '../../../../utils/getApiHost'
import useCreate from '../../../../hooks/useCreate'
import FormLayout from '../../../../components/Form/Layout'
import FormRow from '../../../../components/Form/FormRow'
import FocusError from '../../../../components/Form/FocusError'
import Dropzone from '../../../../components/Dropzone'
import ACCEPT from '../../../../components/Dropzone/accept'
import Table from './Table'
import EditModal from './EditModal'
import { FORM, FORM_ITEM } from './constants'

const putImageHost = getApiHost('VITE_AWS_PUT_IMAGE_HOST')
const putImageEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/putimage`

const ACTION = {
  NEW: 'new',
  UPDATE: 'update'
}

const getGroupAssetsByPrefix = (urls) => {
  return groupBy(urls, (url) => {
    if (url.startsWith('data')) {
      return 'base64'
    }
    return 's3Url'
  })
}

const getParamsListFromRecognitionData = (row = {}) => {
  const { name } = get(row, FORM_ITEM.UPLOAD_FILE, {})
  const {
    fishType,
    itemSerial,
    itemImages = [],
    itemVideo = ''
  } = get(row, FORM_ITEM.RECOGNITION_DATA, {})
  const itemVideos = [itemVideo]
  const [
    { base64: base64Images = [], s3Url: s3Images = [] },
    { base64: base64Videos = [], s3Url: s3Videos = [] }
  ] = [itemImages, itemVideos].map(getGroupAssetsByPrefix)
  const base64Files = [...base64Videos, ...base64Images]
  const paramsList = map(isEmpty(base64Files) ? [''] : base64Files, (fileName, index) => {
    const isNew = index === 0
    return {
      fishType,
      itemSerial,
      action: isNew ? ACTION.NEW : ACTION.UPDATE,
      ...(isEmpty(fileName) ? {} : { fileName }),
      ...(
        isNew && {
          itemImages: s3Images,
          itemVideos: s3Videos
        }
      )
    }
  })
  return { name, paramsList }
}

const validationSchema = Yup.object().shape({
  [FORM.ROWS]: Yup.array()
    .min(1).required('Miss select video.')
    .of(
      Yup.object().shape({
        [FORM_ITEM.IS_UPLOADED]: Yup.boolean()
          .isTrue().required('Uploading or upload failed.')
      })
    )
})

const Batch = () => {
  const [editItem, setEditItem] = useState({})
  const dropzoneRef = useRef()
  const modalRef = useRef()
  const { t } = useTranslation()
  const { trigger: putImage, isMutating } = useCreate(putImageHost)

  const onSubmit = async (formValues, formProps) => {
    const toastId = toast.loading('Creating...')
    const rows = get(formValues, FORM.ROWS, [])
    const batchParamsList = map(rows, getParamsListFromRecognitionData)
    const [error, resultList] = await safeAwait(
      Promise.all(map(batchParamsList, async ({ paramsList = [] }) => {
        const [newParams, ...updateParamsList] = paramsList
        const [newError] = await safeAwait(
          putImage({ url: putImageEndPoint, body: newParams })
        )
        if (newError) {
          console.log(newError)
          return { isSuccess: false }
        }

        const [updateError] = await safeAwait(
          Promise.all(updateParamsList.map((param) => {
            return putImage({ url: putImageEndPoint, body: param })
          }))
        )
        if (updateError) {
          console.log(updateError)
          return { isSuccess: false }
        }

        return { isSuccess: true }
      }))
    )

    if (isUndefined(error)) {
      toast.success('Finish!', { id: toastId })
      formProps.resetForm()
      return
    }

    const newRows = filter(rows, (row, index) => {
      const { isSuccess } = get(resultList, index, {})
      return !isSuccess
    })
    toast('Some records not success.', { id: toastId })
    formProps.resetForm({
      values: { [FORM.ROWS]: newRows }
    })
  }

  const onSelectFilesFinish = (formProps) => (newFiles) => {
    const currentRows = get(formProps.values, FORM.ROWS, [])
    const rows = newFiles.map((newFile, index) => {
      const {
        [FORM_ITEM.RECOGNITION_DATA]: recognitionData = undefined,
        [FORM_ITEM.IS_UPLOADED]: isUploaded = false
      } = get(currentRows, index, {})
      return {
        [FORM_ITEM.UPLOAD_FILE]: newFile,
        [FORM_ITEM.RECOGNITION_DATA]: recognitionData,
        [FORM_ITEM.IS_UPLOADED]: isUploaded
      }
    })
    formProps.setFieldValue(FORM.ROWS, rows)
  }

  const onRemove = (formProps) => async (index) => {
    const rows = get(formProps.values, FORM.ROWS, [])
    dropzoneRef.current.removeFile(index)
    await wait()
    const filteredRows = rows.filter((row, rowIndex) => rowIndex !== index)
    formProps.setFieldValue(FORM.ROWS, filteredRows)
  }

  const onEdit = (newEditItem) => {
    setEditItem(newEditItem)
    modalRef.current.open()
  }

  const onUpdated = (formProps) => (field, row) => {
    formProps.setFieldValue(field, row)
  }

  const onCloseEditModal = () => setEditItem({})

  const onRefreshAllFailedRows = () => {
    const refreshBtns = document.querySelectorAll('button[data-role="triggerRefresh"]')
    for (const btn of [...refreshBtns]) {
      btn.click()
    }
  }

  return (
    <Formik
      initialValues={{
        [FORM.VIDEOS]: [],
        [FORM.ROWS]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formProps) => (
        <>
          <Form>
            <FormLayout>
              <div role='alert' className='alert'>
                <GrMultiple size='1.5em' />
                <span>
                  Upload multiple videos
                  or select one folder will upload all videos under selected folder,
                  service will generate information and images,
                  please edit and confirm before submit.
                </span>
              </div>
              <FormRow
                label={`${t('video')}`}
                error={formProps.touched[FORM.VIDEOS] && formProps.errors[FORM.VIDEOS]}
              >
                <Dropzone
                  dropzoneRef={dropzoneRef}
                  name={FORM.VIDEOS}
                  accept={ACCEPT.VIDEO}
                  onFinish={onSelectFilesFinish(formProps)}
                  maxSize={Infinity}
                  isShowPreview={false}
                  isSelectFolder
                />
              </FormRow>
              {isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert grid-flow-col justify-start'>
                    <MdWarning size='1.5em' />
                    <span>No video exist.</span>
                  </div>
                </FormRow>
              )}
              {!isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert grid-flow-col'>
                    <MdChecklist size='1.5em' />
                    <span>
                      {`Selected ${size(formProps.values[FORM.ROWS])} videos`}
                    </span>
                    <button
                      type='button'
                      className='btn btn-square btn-outline'
                      disabled={formProps.isValid}
                      onClick={onRefreshAllFailedRows}
                    >
                      <MdOutlineRefresh size='1.5em' />
                    </button>
                  </div>
                  <Table
                    data={formProps.values[FORM.ROWS]}
                    field={FORM.ROWS}
                    onRemove={onRemove(formProps)}
                    onEdit={onEdit}
                    onUpdated={onUpdated(formProps)}
                  />
                </FormRow>
              )}
              <div className='text-right'>
                <button
                  type='submit'
                  className='btn btn-outline'
                  disabled={(
                    isMutating ||
                    isEmpty(formProps.values[FORM.ROWS]) ||
                    !isEmpty(formProps.errors)
                  )}
                >
                  <MdAdd size='1.5em' />
                  {t('newItem')}
                </button>
              </div>
              <FocusError />
            </FormLayout>
          </Form>
          <EditModal
            modalRef={modalRef}
            editItem={editItem}
            onClose={onCloseEditModal}
            onUpdated={onUpdated(formProps)}
          />
        </>
      )}
    </Formik>
  )
}

export default Batch
