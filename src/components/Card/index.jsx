const Card = (props) => {
  const {
    onImageClick,
    item: {
      id, images, type, price
    } = {}
  } = props
  const imgUrl = new URL(`./${images[0]}`, import.meta.url).href
  return (
    <div className='p-4 max-xl:w-1/2 max-sm:w-full xl:w-1/3'>
      <div className='card bg-base-100 shadow-xl'>
        <figure><img onClick={onImageClick} className='cursor-pointer' src={imgUrl} alt='Shoes' /></figure>
        <div className='card-body'>
          <h2 className='card-title'>
            <div className='flex flex-wrap'>
              <div className='w-1/3'>
                {`No.${id}`}
              </div>
              <div className='w-2/3 text-right'>
                {type}
              </div>
              <div className='w-full py-2'>
                {`$${price} NTD`}
              </div>
            </div>
          </h2>
          <div className='card-actions justify-end'>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <input type='checkbox' className='checkbox-primary checkbox mr-2' />
                <span className='label-text'>ADD TO CART</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
