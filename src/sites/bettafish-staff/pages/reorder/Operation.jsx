import {
  get,
  isEmpty
} from 'lodash-es'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import useCreateUploadTankInfo from '../../../../hooks/useCreateUploadTankInfo'
import useBettaFishSystemState from '../../../../hooks/useBettaFishSystemState'
import useCreateBettaFishSystemState from '../../../../hooks/useCreateBettaFishSystemState'
import useJsonBlock from '../../../../components/JsonBlock/useJsonBlock'

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
    return { isSystemStateFail, isOn: false, isOff: false }
  }

  const status = get(data, 'results.systems[0].status')
  const isOn = status === SYSTEM_STATUS.ON
  const isOff = status === SYSTEM_STATUS.OFF
  return { isSystemStateFail: false, isOn, isOff }
}

const Option = (props) => {
  const { label } = props
  const { isMutating: isLoading } = useCreateUploadTankInfo()
  const { data: bettaFishSystemStateData } = useBettaFishSystemState({ system_type: SYSTEM_TYPE })
  const {
    trigger: createBettaFishSystemState,
    data: createBettaFishSystemStateData
  } = useCreateBettaFishSystemState()
  const { isOn } = getSystemState(
    isEmpty(createBettaFishSystemStateData)
      ? bettaFishSystemStateData
      : createBettaFishSystemStateData
  )
  const [, setJsonBlock] = useJsonBlock()

  const onUpdateSystemState = async (e) => {
    const nextChecked = get(e, 'target.checked', false)
    const action = nextChecked ? SYSTEM_STATUS.ON : SYSTEM_STATUS.OFF
    const msgPrefix = SYSTEM_STATUS_MAP[action]
    const message = `${msgPrefix}服務`
    const toastId = toast.loading(`${message}中...`)
    const [createError, result] = await safeAwait(createBettaFishSystemState({
      action,
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

    toast.success(`${message} 成功!`, { id: toastId })
  }

  return (
    <label className='label cursor-pointer'>
      <span className='label-text'>{label}</span>
      <input
        type='checkbox'
        className='toggle toggle-primary'
        onChange={onUpdateSystemState}
        checked={isOn}
        disabled={isLoading}
      />
    </label>
  )
}

const Operation = () => {
  return (
    <div className='alert flex w-full flex-col items-start gap-4'>
      <div className='flex w-full flex-col gap-4 rounded-md bg-white px-2 py-1'>
        <Option
          label='開啟鬥魚系統'
        />
      </div>
      <div className='divider !my-0 w-full' />
      <a
        href='https://bettafish4test.uniheart.com.tw/'
        className='btn btn-outline w-full'
      >
        進入報價單內部系統
      </a>
      <a
        href='https://bettafish.uniheart.com.tw/'
        className='btn btn-outline w-full'
      >
        進入報價單外部系統
      </a>
    </div>
  )
}

export default Operation
