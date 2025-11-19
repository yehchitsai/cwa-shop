import safeJSON from '../../utils/safeJSON'
import useJsonBlock from './useJsonBlock'

const JsonBlock = () => {
  const [json] = useJsonBlock()
  return (
    <div className='alert flex w-full flex-col items-start gap-4 md:w-1/3'>
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
