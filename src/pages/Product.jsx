import { useMemo } from 'react'
import { get } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { MdAdd } from 'react-icons/md'
import clx from 'classnames'
import useFishTypes from '../hooks/useFishTypes'
import Dropzone from '../components/Dropzone'
import ACCEPT from '../components/Dropzone/accept'

const Product = () => {
  const { i18n } = useTranslation()
  const { fishTypes } = useFishTypes(i18n.language)
  const fishType = useMemo(
    () => get(fishTypes, '0.value'),
    [fishTypes]
  )

  const onSelectType = console.log

  return (
    <div className='m-auto flex w-full flex-col max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
      <div className='form-control w-full'>
        <label className='label'>
          <span className='label-text'>商品分類</span>
        </label>
        <select
          className={clx(
            'select select-bordered w-full lg:max-w-xs'
          )}
          onChange={onSelectType}
          defaultValue={fishType}
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
          <span className='label-text'>魚缸編號</span>
        </label>
        <input type='text' placeholder='Type here' className='input input-bordered w-full lg:max-w-xs' />
      </div>
      <br />
      <label className='label'>
        <span className='label-text'>圖片</span>
      </label>
      <Dropzone
        accept={ACCEPT.IMAGE}
      />
      <br />
      <label className='label'>
        <span className='label-text'>影片</span>
      </label>
      <Dropzone
        accept={ACCEPT.VIDEO}
      />
      <br />
      <div className='text-right'>
        <button
          type='button'
          className='btn btn-outline'
        >
          <MdAdd size='1.5em' />
          {' 新增'}
        </button>
      </div>
    </div>
  )
}

export default Product
