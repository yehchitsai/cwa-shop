import Model from '..'

const ProductModel = (props) => {
  const { id } = props
  return (
    <Model
      id={id}
      title='Hello!'
    >
      <p className='py-4'>Press ESC key or click the button below to close</p>
    </Model>
  )
}

export default ProductModel
