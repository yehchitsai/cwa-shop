import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { GrMultiple } from 'react-icons/gr'
import {
  MdAdd, MdWarning, MdChecklist
} from 'react-icons/md'
import { get, isEmpty, size } from 'lodash-es'
import wait from '../../../../utils/wait'
// import getApiHost from '../../../../utils/getApiHost'
// import useCreate from '../../../../hooks/useCreate'
import FormLayout from '../../../../components/Form/Layout'
import FormRow from '../../../../components/Form/FormRow'
import FocusError from '../../../../components/Form/FocusError'
import Dropzone from '../../../../components/Dropzone'
import ACCEPT from '../../../../components/Dropzone/accept'
import Table from './Table'
import EditModal from './EditModal'

// const putImageHost = getApiHost('VITE_AWS_PUT_IMAGE_HOST')
// const putImageEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/putimage`

const FORM = {
  VIDEOS: 'videos',
  ROWS: 'rows'
}

const validationSchema = Yup.object().shape({
  [FORM.VIDEOS]: Yup.array().min(1).required('Miss video!')
}, [])

const Batch = () => {
  const [editItem, setEditItem] = useState({})
  const dropzoneRef = useRef()
  const modalRef = useRef()
  const { t } = useTranslation()
  // const { trigger: putImage } = useCreate(putImageHost)

  // const onSubmit = async (formValues, { setSubmitting }) => {}
  const onSubmit = async (formValues) => {
    console.log(formValues)
  }

  const onSelectFilesFinish = (formProps) => (newFiles) => {
    const rows = newFiles.map((newFile) => ({
      uploadFile: newFile,
      recognitionData: {},
      isUploaded: false
    }))
    formProps.setFieldValue(FORM.ROWS, rows)
  }

  const onRemove = (formProps) => async (index) => {
    const rows = get(formProps.values, FORM.ROWS, [])
    dropzoneRef.current.removeFile(index)
    await wait()
    const filteredRows = rows.filter((row, rowIndex) => rowIndex !== index)
    formProps.setFieldValue(FORM.ROWS, filteredRows)
  }

  const onEdit = (obj) => {
    console.log(obj)
    setEditItem(obj)
    modalRef.current.open()
  }

  const onUpdated = (formProps) => (field, row) => {
    formProps.setFieldValue(field, row)
  }

  const onCloseEditModal = () => setEditItem({})

  return (
    <>
      <Formik
        initialValues={{
          [FORM.VIDEOS]: [],
          [FORM.ROWS]: []
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formProps) => (
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
                  isShowPreview={false}
                  isSelectFolder
                />
              </FormRow>
              {isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert'>
                    <MdWarning size='1.5em' />
                    <span>No video exist.</span>
                  </div>
                </FormRow>
              )}
              {!isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert'>
                    <MdChecklist size='1.5em' />
                    <span>
                      Selected
                      {` ${size(formProps.values[FORM.ROWS])} `}
                      videos
                    </span>
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
                  // disabled={isMutating}
                >
                  <MdAdd size='1.5em' />
                  {`${t('newItem')}`}
                </button>
              </div>
              <FocusError />
            </FormLayout>
          </Form>
        )}
      </Formik>
      <EditModal
        modalRef={modalRef}
        editItem={editItem}
        onClose={onCloseEditModal}
      />
    </>
  )
}

export default Batch
