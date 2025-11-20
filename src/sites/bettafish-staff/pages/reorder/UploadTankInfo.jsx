import { useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import { MdInfo } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  get,
  isEmpty,
  isUndefined
} from 'lodash-es'
import clx from 'classnames'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'
import getFormValues from '../../../../utils/getFormValues'
import useJsonBlock from '../../../../components/JsonBlock/useJsonBlock'
import useRecoverData from '../../../../hooks/useRecoverData'
import useCreateUploadTankInfo from '../../../../hooks/useCreateUploadTankInfo'
import useBettaFishSystemState from '../../../../hooks/useBettaFishSystemState'
import useCreateBettaFishSystemState from '../../../../hooks/useCreateBettaFishSystemState'
import useCreateRecoverData from '../../../../hooks/useCreateRecoverData'
import useCreateBackupData from '../../../../hooks/useCreateBackupData'

const FORM = {
  EXCEL: 'excel'
}

const validationSchema = Yup.object().shape({
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const SYSTEM_TYPE = 'internal'

const SYSTEM_STATUS = {
  ON: 'on',
  OFF: 'off'
}

const SYSTEM_STATUS_MAP = {
  [SYSTEM_STATUS.ON]: '開啟',
  [SYSTEM_STATUS.OFF]: '關閉'
}

const getSystemState = (data) => {
  const isSystemStateFail = get(data, 'status') === 'fail'
  if (isSystemStateFail) {
    return { isSystemStateFail, isOn: null, isOff: null }
  }

  const status = get(data, 'results.systems[0].status')
  const isOn = status === SYSTEM_STATUS.ON
  const isOff = status === SYSTEM_STATUS.OFF
  return { isSystemStateFail: false, isOn, isOff }
}

const UploadTankInfo = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const { data: recoverDataResult } = useRecoverData()
  const { trigger: createUploadTankInfo, isMutating: isLoading } = useCreateUploadTankInfo()
  const { data: bettaFishSystemStateData } = useBettaFishSystemState({ system_type: SYSTEM_TYPE })
  const {
    trigger: createBettaFishSystemState,
    data: createBettaFishSystemStateData
  } = useCreateBettaFishSystemState()
  const {
    isMutating: isRecoverDataLoading,
    trigger: createRecoverData
  } = useCreateRecoverData()
  const {
    isMutating: isBackupDataLoading,
    trigger: createBackupData
  } = useCreateBackupData()
  const { isOff, isOn } = getSystemState(
    isEmpty(createBettaFishSystemStateData)
      ? bettaFishSystemStateData
      : createBettaFishSystemStateData
  )
  const recoverData = get(recoverDataResult, 'results.data', [])
  const [, setJsonBlock] = useJsonBlock()

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
      body: {
        file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
      }
    }
    const toastId = toast.loading('Uploading...')
    const [createError, result] = await safeAwait(createUploadTankInfo(postParams))
    clearForm()
    setJsonBlock(result)
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    setIsExcelUploaded(false)
  }

  const onUpdateBettaFishSystemState = async (status) => {
    const msgPrefix = SYSTEM_STATUS_MAP[status]
    const message = `${msgPrefix}服務中...`
    const toastId = toast.loading(message)
    const [createError, result] = await safeAwait(createBettaFishSystemState({
      action: status,
      system_type: SYSTEM_TYPE
    }))
    setJsonBlock(result)
    if (createError) {
      toast.error(`${createError.message}`, { id: toastId })
      return
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success(`${msgPrefix}服務成功!`, { id: toastId })
  }

  const onRecover = async (recovery_point) => {
    const toastId = toast.loading(`恢復至 ${recovery_point} 中...`)
    const [createError, result] = await safeAwait(createRecoverData({
      recovery_point
    }))
    setJsonBlock(result)
    if (createError) {
      toast.error(`${createError.message}`, { id: toastId })
      return
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success(`恢復至 ${recovery_point} 成功!`, { id: toastId })
  }

  const onBackupData = async () => {
    const toastId = toast.loading('資料備份中')
    const [createError, result] = await safeAwait(createBackupData())
    setJsonBlock(result)
    if (createError) {
      toast.error(`${createError.message}`, { id: toastId })
      return
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success('資料備份成功!', { id: toastId })
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
              上傳系統排好的櫃位excel
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
          <div className='flex justify-end gap-2'>
            <button
              ref={resetBtn}
              type='reset'
              className='hidden'
            >
              reset
            </button>
            <button
              type='button'
              className='btn btn-outline'
              disabled={isBackupDataLoading}
              onClick={onBackupData}
            >
              資料備份
            </button>
            <div className='dropdown dropdown-top dropdown-hover'>
              <div
                tabIndex={0}
                role='button'
                className={clx('btn btn-outline', {
                  'btn-disabled': isEmpty(recoverData) || isRecoverDataLoading
                })}
              >
                Recover
              </div>
              <ul
                tabIndex={-1}
                className={clx('menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow', {
                  hidden: isEmpty(recoverData) || isRecoverDataLoading
                })}
              >
                {recoverData.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => onRecover(item)}
                    >
                      <span>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <button
              type='button'
              className='btn btn-outline'
              disabled={isLoading || isOff}
              onClick={() => onUpdateBettaFishSystemState(SYSTEM_STATUS.OFF)}
            >
              關閉服務
            </button>
            <button
              type='button'
              className='btn btn-outline'
              disabled={isLoading || isOn}
              onClick={() => onUpdateBettaFishSystemState(SYSTEM_STATUS.ON)}
            >
              開啟服務
            </button>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              <FaPlus />
              New item
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default UploadTankInfo
