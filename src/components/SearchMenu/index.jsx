import clx from 'classnames'
import {
  MdSearch, MdFilterAlt
} from 'react-icons/md'
import { IoSparklesSharp } from 'react-icons/io5'
import { isEmpty } from 'lodash-es'
import wait from '../../utils/wait'
import { PHASE_TYPE } from './constants'

const SearchMenu = (props) => {
  const { name, searchMenuAction } = props
  const {
    setPhase,
    currentPhase,
    setCurrentPhase,
    phaseType,
    setPhaseType,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    isPhaseEmpty
  } = searchMenuAction

  const onPhaseChange = (e) => {
    const newPhase = e.target.value
    setCurrentPhase(newPhase)
    if (!isEmpty(newPhase)) {
      return
    }
    setPhaseType(null)
  }

  const onPhaseTypeChange = async () => {
    await wait(300)
    setIsFilterMenuOpen(false)
    setPhase(currentPhase)
  }

  return (
    <>
      <label
        className={clx(
          'input input-sm input-bordered flex items-center !outline-none',
          { 'rounded-b-none !border-b-transparent': isFilterMenuOpen }
        )}
      >
        <input
          name={name}
          type='text'
          className='grow'
          placeholder='Search'
          autoComplete='off'
          defaultValue={currentPhase}
          onFocus={() => setIsFilterMenuOpen(true)}
          onBlur={onPhaseTypeChange}
          onChange={onPhaseChange}
        />
        {phaseType === PHASE_TYPE.AI && (
          <IoSparklesSharp
            size='1.5em'
            className='!fill-yellow-300'
          />
        )}
        {phaseType === PHASE_TYPE.NORMAL && (
          <MdFilterAlt
            size='1.5em'
            className='!fill-indigo-500'
          />
        )}
        {phaseType === null && (
          <MdSearch size='1.5em' />
        )}
      </label>
      <div className='relative'>
        <div
          className={clx(
            'absolute top-0 left-0 z-10 w-full',
            'menu w-56 rounded-b-lg bg-white border-base-content/20 border',
            { hidden: !isFilterMenuOpen }
          )}
        >
          <ul className='menu-dropdown'>
            <li
              className={clx(
                'disabled pointer-events-none',
                { disabled: isPhaseEmpty }
              )}
              onClick={() => !isPhaseEmpty && setPhaseType(PHASE_TYPE.AI)}
            >
              <span
                className={clx(
                  'break-all',
                  { active: phaseType === PHASE_TYPE.AI }
                )}
              >
                <IoSparklesSharp
                  size='1.5em'
                  className='!fill-yellow-300'
                />
                AI 搜尋
                {isPhaseEmpty ? '' : ` "${currentPhase}"`}
              </span>
            </li>
            <li
              className={clx({ disabled: isPhaseEmpty })}
              onClick={() => !isPhaseEmpty && setPhaseType(PHASE_TYPE.NORMAL)}
            >
              <span
                className={clx(
                  'break-all',
                  { active: phaseType === PHASE_TYPE.NORMAL }
                )}
              >
                <MdFilterAlt
                  size='1.5em'
                  className='!fill-indigo-500'
                />
                一般過濾
                {isPhaseEmpty ? '' : ` "${currentPhase}"`}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default SearchMenu
