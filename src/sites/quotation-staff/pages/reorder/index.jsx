import JsonBlock from '../../../../components/JsonBlock'
import UploadNewFish from './UploadNewFish'
import UploadTankInfo from './UploadTankInfo'

const Page = () => {
  return (
    <div className='m-auto flex w-full flex-col gap-4 max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
      <div className='flex flex-col gap-2 md:flex-row'>
        <div className='md:flex-1'>
          <UploadNewFish />
          <div className='divider my-2' />
          <UploadTankInfo />
        </div>
        <JsonBlock className='min-w-72 flex-none' />
      </div>
    </div>
  )
}

export default Page
