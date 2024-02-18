import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { GrMultiple } from 'react-icons/gr'
import {
  MdAdd, MdWarning, MdChecklist
} from 'react-icons/md'
import { isEmpty, size } from 'lodash-es'
import wait from '../../../../utils/wait'
import FormLayout from '../../../../components/Form/Layout'
import FormRow from '../../../../components/Form/FormRow'
import FocusError from '../../../../components/Form/FocusError'
import Dropzone from '../../../../components/Dropzone'
import ACCEPT from '../../../../components/Dropzone/accept'
import Table from './Table'
import EditModal from './EditModal'

const FORM = {
  VIDEOS: 'videos'
}

const validationSchema = Yup.object().shape({
  [FORM.VIDEOS]: Yup.array().min(1).required('Miss video!')
}, [])

const Batch = () => {
  const [files, setFiles] = useState([])
  const [editItem, setEditItem] = useState({})
  const dropzoneRef = useRef()
  const modalRef = useRef()
  const { t } = useTranslation()

  // const onSubmit = async (formValues, { setSubmitting }) => {}
  const onSubmit = async () => {
    console.log(dropzoneRef.current.getAcceptedFiles())
  }

  const onSelectFilesFinish = (newFiles) => setFiles(newFiles)

  const onRemove = async (index) => {
    dropzoneRef.current.removeFile(index)
    await wait()
    const newFiles = dropzoneRef.current.getAcceptedFiles()
    setFiles(newFiles)
  }

  const onEdit = (obj) => {
    console.log(obj)
    setEditItem(obj)
    modalRef.current.open()
  }

  const onCloseEditModal = () => setEditItem({})

  return (
    <>
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
                error={touched[FORM.VIDEOS] && errors[FORM.VIDEOS]}
              >
                <Dropzone
                  dropzoneRef={dropzoneRef}
                  name={FORM.VIDEOS}
                  accept={ACCEPT.VIDEO}
                  onFinish={onSelectFilesFinish}
                  isShowPreview={false}
                  isSelectFolder
                />
              </FormRow>
              {isEmpty(files) && (
                <FormRow>
                  <div role='alert' className='alert'>
                    <MdWarning size='1.5em' />
                    <span>No video exist.</span>
                  </div>
                </FormRow>
              )}
              {!isEmpty(files) && (
                <FormRow>
                  <div role='alert' className='alert'>
                    <MdChecklist size='1.5em' />
                    <span>
                      Selected
                      {` ${size(files)} `}
                      videos
                    </span>
                  </div>
                  <Table
                    data={files}
                    onRemove={onRemove}
                    onEdit={onEdit}
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
