const Card = (props) => {
  const {
    item: {
      id, images, type, price
    } = {}
  } = props
  const imgUrl = new URL(`./${images[0]}`, import.meta.url).href
  return (
    <div className='p-4 max-xl:w-1/2 max-sm:w-full xl:w-1/3'>
      <div className='card bg-base-100 shadow-xl'>
        <figure><img src={imgUrl} alt='Shoes' /></figure>
        <div className='card-body'>
          <h2 className='card-title'>
            <div className='flex flex-wrap'>
              <div className='w-1/3'>
                {`No.${id}`}
              </div>
              <div className='w-2/3 text-right'>
                {`$${price} NTD`}
              </div>
              <div className='w-full'>
                {type}
              </div>
            </div>
          </h2>
          <div className='card-actions justify-end'>
            <button type='button' className='btn btn-primary btn-outline'>
              add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
