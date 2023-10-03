import LazyImage from '../LazyImage'

const Card = (props) => {
  const {
    onImageClick,
    onSelectProduct,
    item = {}
  } = props
  const {
    itemSerial, imageURL
  } = item
  return (
    <div className='p-4 max-xl:w-1/2 max-sm:w-full xl:w-1/3'>
      <div className='card bg-base-100 shadow-xl'>
        <figure
          className='cursor-pointer'
          style={{ display: 'block' }}
          onClick={onImageClick}
        >
          <LazyImage
            src={imageURL}
            alt={itemSerial}
            loaderClassName='w-full h-[10rem]'
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>
            <div className='flex flex-wrap'>
              <div className='w-full'>
                {`No.${itemSerial}`}
              </div>
            </div>
          </h2>
          <div className='card-actions justify-end'>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <input
                  type='checkbox'
                  className='checkbox-primary checkbox mr-2'
                  onChange={onSelectProduct(item)}
                />
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
