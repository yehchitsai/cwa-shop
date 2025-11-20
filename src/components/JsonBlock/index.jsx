import clx from 'classnames'
import safeJSON from '../../utils/safeJSON'
import useJsonBlock from './useJsonBlock'

const JsonBlock = ({ className }) => {
  const [json] = useJsonBlock()
  return (
    <div
      className={clx('alert flex w-full flex-col items-start gap-4', { [className]: className })}
    >
      <div>
        API response
      </div>
      <div>
        <pre className='whitespace-break-spaces break-all text-left'>
          {safeJSON(json)}
        </pre>
      </div>
    </div>
  )
}

export default JsonBlock
