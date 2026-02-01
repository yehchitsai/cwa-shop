import { times } from 'lodash-es'
import clx from 'classnames'
import { MdOutlineDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import CountSelect from '../CountSelect'

const Confirm = () => {
  const { t } = useTranslation()
  return (
    <div
      className='m-auto h-auto max-lg:max-w-2xl max-sm:min-w-full lg:max-w-5xl'
    >
      {/* <div className='h-[calc(100dvh-5.5rem)] overflow-x-auto'> */}
      <div className='h-[calc(100dvh-8.5rem)] overflow-x-auto'>
        <table className='table table-pin-rows table-pin-cols'>
          <thead>
            <tr className='max-sm:-top-1'>
              <th>項次</th>
              <td>品名</td>
              <td>尺寸</td>
              <td>單價</td>
              <td>購買數量</td>
              <td>特殊要求</td>
              <td>金額</td>
              <th />
            </tr>
          </thead>
          <tbody>
            {times(50, (index) => {
              return (
                <tr
                  key={index}
                  className={clx(
                    'whitespace-nowrap cursor-pointer'
                  )}
                >
                  <th className='text-sm'>
                    {index + 1}
                  </th>
                  <td>{`品名${index}`}</td>
                  <td>{`尺寸${index}`}</td>
                  <td>{`單價${index}`}</td>
                  <td>
                    <CountSelect
                      max={index + 5}
                      className='w-24'
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      className='input input-sm input-bordered w-40'
                      defaultValue={`特殊要求${index}`}
                    />
                  </td>
                  <td>{`金額${index}`}</td>
                  <th className='text-right'>
                    <button
                      type='button'
                      className='btn btn-square btn-outline btn-error'
                    >
                      <MdOutlineDelete
                        size='1.5em'
                      />
                    </button>
                  </th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='my-2 mr-4 flex justify-end gap-2'>
        <div className='mr-4 flex items-center justify-center break-all'>
          總金額：
          <br />
          10000000 NTD
        </div>
        <div>
          <button
            type='button'
            className='btn btn-outline btn-success'
            // disabled={isUpdating}
            // onClick={onOrder}
          >
            {`${t('submitCart')}`}
          </button>
        </div>
        <div>
          <button
            type='button'
            className='btn btn-outline btn-error'
            // onClick={onRemoveAll}
            // disabled={isUpdating}
          >
            {`${t('removerAll')}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Confirm
