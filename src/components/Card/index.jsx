const Card = () => {
  const imgUrl = new URL('./img.jpg', import.meta.url).href
  return (
    <div className='p-4 max-xl:w-1/2 max-sm:w-full xl:w-1/3'>
      <div className='card bg-base-100 shadow-xl'>
        <figure><img src={imgUrl} alt='Shoes' /></figure>
        <div className='card-body'>
          <h2 className='card-title'>Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className='card-actions justify-end'>
            <button type='button' className='btn btn-primary'>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
