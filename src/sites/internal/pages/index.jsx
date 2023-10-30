import { useMemo, useRef, useState } from 'react'
import {
  concat, get, pick, values
} from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { MdAdd } from 'react-icons/md'
import clx from 'classnames'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import useFishTypes from '../../../hooks/useFishTypes'
import useCreate from '../../../hooks/useCreate'
import Dropzone from '../../../components/Dropzone'
import ACCEPT from '../../../components/Dropzone/accept'
import getFormValues from '../../../utils/getFormValues'
import getApiHost from '../../../utils/getApiHost'

const putImageHost = getApiHost('VITE_AWS_DYNAMIC_HOST4')
const putImageEndPoint = `${import.meta.env.VITE_AWS_HOST_PREFIX}/putimage`

const FORM = {
  TYPE: 'fishType',
  ITEM_SERIAL: 'itemSerial',
  IMAGES: 'images',
  VIDEOS: 'videos'
}
const FIELDS = values(FORM)
const ACTION = {
  NEW: 'new',
  UPDATE: 'update'
}

const Product = () => {
  const { t, i18n } = useTranslation()
  const { fishTypes } = useFishTypes(i18n.language)
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
  const imageState = useState([])
  const videoState = useState([])
  const setImagesValue = imageState[1]
  const setVideosValue = videoState[1]
  const resetBtn = useRef()
  const isMutating = (isMutatingNewFishData || isMutatingUpdatedFishData)

  const clearForm = () => {
    resetBtn.current.click()
    setImagesValue([])
    setVideosValue([])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formValues = getFormValues(e.target, FIELDS, [FORM.IMAGES, FORM.VIDEOS])
    const assets = concat(
      get(formValues, FORM.IMAGES).map((data) => ({ data, type: FORM.IMAGES })),
      get(formValues, FORM.VIDEOS).map((data) => ({ data, type: FORM.VIDEOS }))
    )
    const paramsList = assets.map((asset, index) => {
      const action = index === 0 ? ACTION.NEW : ACTION.UPDATE
      const params = {
        url: putImageEndPoint,
        ...pick(formValues, [FORM.TYPE, FORM.ITEM_SERIAL]),
        fileName: asset.data,
        action
      }
      return params
    })
    const [newParams, ...updateParamsList] = paramsList
    console.log(formValues, paramsList)

    const toastId = toast.loading('Creating...')
    const [createError, createRes] = await safeAwait(createFishData(newParams))
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
    }

    const [updateError, updateRes] = await safeAwait(
      Promise.all(updateParamsList.map(updateFishData))
    )
    if (updateError) {
      toast.error(`Error! ${updateError.message}`, { id: toastId })
    }

    toast.success('Finish!', { id: toastId })
    clearForm()
    console.log({ createRes, updateRes })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>{`${t('fishType')}`}</span>
          </label>
          <select
            name={FORM.TYPE}
            className={clx(
              'select select-bordered w-full lg:max-w-xs'
            )}
            defaultValue={fishType}
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
          </select>
        </div>
        <br />
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>{`${t('tankNo')}`}</span>
          </label>
          <input
            type='text'
            name={FORM.ITEM_SERIAL}
            placeholder='Type here'
            className='input input-bordered w-full lg:max-w-xs'
            autoComplete='off'
            disabled={isMutating}
          />
        </div>
        <br />
        <label className='label'>
          <span className='label-text'>{`${t('pictures')}`}</span>
        </label>
        <Dropzone
          name={FORM.IMAGES}
          state={imageState}
          accept={ACCEPT.IMAGE}
          disabled={isMutating}
        />
        <br />
        <label className='label'>
          <span className='label-text'>{`${t('video')}`}</span>
        </label>
        <Dropzone
          name={FORM.VIDEOS}
          state={videoState}
          accept={ACCEPT.VIDEO}
          disabled={isMutating}
        />
        <br />
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
    </form>
  )
}

export default Product
