import Coupon from './Coupon'
import Quotation from './Quotation'

const Page = () => {
  return (
    <>
      <Quotation />
      <div className='divider m-auto flex max-w-[80dvw]' />
      <Coupon />
    </>
  )
}

export default Page
