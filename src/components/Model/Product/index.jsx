import clx from 'classnames'
import { LuArrowRightFromLine, LuArrowLeftFromLine } from 'react-icons/lu'
import { times, size } from 'lodash-es'
import Model from '..'
import Drawer from '../../Drawer'

const imgUrls = times(4, (index) => new URL(`../../Card/img${index}.jpg`, import.meta.url).href)
const maxIndex = size(imgUrls) - 1

const ProductModel = (props) => {
  const { id } = props

  const scrollToOtherImage = (targetIndex) => {
    document.querySelector(`#${id} img[src="${imgUrls[targetIndex]}"]`).scrollIntoView()
  }

  return (
    <Model
      id={id}
      className='h-[100%] min-h-[100%] w-[100%] max-w-[100vw] rounded-none p-0'
      isCloseBtnVisible={false}
    >
      <Drawer
        id='productInfoSidebar'
        className='bg-slate-100/30'
        openIcon={LuArrowLeftFromLine}
        closeIcon={LuArrowRightFromLine}
        overlay={false}
        isRoot={false}
        rwd={false}
        defaultOpen
      >
        <div className='carousel h-full w-full items-center rounded-none'>
          {imgUrls.map((imgUrl, index) => {
            const prevIndex = index - 1
            const nextIndex = index + 1
            return (
              <div
                key={imgUrl}
                className='carousel-item relative flex h-[100%] w-full items-center justify-center overflow-y-auto'
              >
                <button
                  type='button'
                  className={clx(
                    'btn btn-circle glass absolute left-4 z-10',
                    { hidden: prevIndex === -1 }
                  )}
                  onClick={() => scrollToOtherImage(prevIndex)}
                >
                  ❮
                </button>
                <img
                  src={imgUrl}
                  alt='Carousel component'
                />
                <button
                  type='button'
                  className={clx(
                    'btn btn-circle glass absolute right-4 z-10',
                    { hidden: nextIndex > maxIndex }
                  )}
                  onClick={() => scrollToOtherImage(nextIndex)}
                >
                  ❯
                </button>
              </div>
            )
          })}
        </div>
      </Drawer>
    </Model>
  )
}

export default ProductModel
