import { useEffect, useCallback } from 'react'
import clx from 'classnames'
import { LuArrowRightFromLine, LuArrowLeftFromLine } from 'react-icons/lu'
import { times, size, delay } from 'lodash-es'
import Model from '..'
import Drawer from '../../Drawer'

const imgUrls = times(4, (index) => new URL(`../../Card/img${index}.jpg`, import.meta.url).href)
const maxIndex = size(imgUrls) - 1
const ESC_KEY_CODE = 27

const ProductModel = (props) => {
  const { id, visible, onClose } = props

  const scrollToOtherImage = (targetIndex) => {
    document.querySelector(`#${id} img[src="${imgUrls[targetIndex]}"]`).scrollIntoView()
  }

  const onClickEsc = useCallback(async (e) => {
    if (e.keyCode !== ESC_KEY_CODE) {
      return
    }

    await delay(() => Promise.resolve(), 100)
    onClose()
  }, [onClose])

  const addListener = useCallback(
    () => document.addEventListener('keydown', onClickEsc, false),
    [onClickEsc]
  )

  const removeListener = useCallback(
    () => document.removeEventListener('keydown', onClickEsc, false),
    [onClickEsc]
  )

  useEffect(() => {
    if (visible) {
      addListener()
    } else {
      removeListener()
    }

    return removeListener
  }, [visible, addListener, removeListener])

  return (
    <Model
      id={id}
      className={clx(
        'h-full min-h-full w-full max-w-[100vw] rounded-none p-0',
        { hidden: !visible }
      )}
      isCloseBtnVisible={false}
      onClose={onClose}
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
        <div className='carousel w-full items-center rounded-none max-md:h-full md:h-[100vh]'>
          {imgUrls.map((imgUrl, index) => {
            const prevIndex = index - 1
            const nextIndex = index + 1
            return (
              <div
                key={imgUrl}
                className='carousel-item relative flex h-full w-full items-center justify-center'
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
                  className='m-auto max-h-full object-scale-down'
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
