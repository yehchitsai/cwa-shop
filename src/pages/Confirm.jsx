// import { Link } from 'react-router-dom'
// import { useRecoilValue, useRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { MdDelete } from 'react-icons/md'
import { get } from 'lodash-es'
import { selectedProductsState } from '../state/selectedProducts'
import useFishTypes from '../hooks/useFishTypes'
import SkeletonHome from '../components/Skeleton/Home'
import LazyImage from '../components/LazyImage'

const Confirm = () => {
  const { i18n } = useTranslation()
  const { fishTypeMap, isLoading } = useFishTypes(i18n.language)
  // const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState)
  const selectedProducts = useRecoilValue(selectedProductsState)

  if (isLoading) {
    return (
      <SkeletonHome />
    )
  }

  return (
    <div
      className='max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'
    >
      <div className='w-full overflow-x-auto'>
        <table className='table table-pin-rows table-pin-cols'>
          <thead>
            <tr>
              <th />
              <th>fishType name</th>
              <th>itemSerial</th>
              <th>itemPrice</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((selectedProduct) => {
              const {
                imageURL, itemSerial, itemPrice, fishType
              } = selectedProduct
              const { fishName } = get(fishTypeMap, fishType, {})
              return (
                <tr key={itemSerial}>
                  <th>
                    <LazyImage
                      src={imageURL}
                      className='m-0 h-20 w-20'
                      alt={fishName}
                      loaderClassName='w-20 h-20'
                    />
                  </th>
                  <td>{fishName}</td>
                  <td>{itemSerial}</td>
                  <td>{itemPrice}</td>
                  <td>
                    <button type='button' className='btn btn-square btn-error btn-outline'>
                      <MdDelete size='1.5em' />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Confirm
