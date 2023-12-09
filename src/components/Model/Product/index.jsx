import { useEffect, useCallback } from 'react'
import clx from 'classnames'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { LuArrowRightFromLine, LuArrowLeftFromLine } from 'react-icons/lu'
import { size, delay, get } from 'lodash-es'
import useFishInfo from '../../../hooks/useFishInfo'
import Drawer from '../../Drawer'
import LazyImage from '../../LazyImage'
import Model from '..'
import useFishTypes from '../../../hooks/useFishTypes'

const ESC_KEY_CODE = 27

const ProductModel = (props) => {
  const {
    id, visible, onClose, product = {}
  } = props
  const {
    itemSerial,
    fishType
  } = product
  const {
    trigger,
    data: {
      // itemVideos = [],
      itemImages = []
    } = {},
    isLoading,
    isMutating
  } = useFishInfo(itemSerial)
  const { i18n, t } = useTranslation()
  const {
    fishTypeMap
  } = useFishTypes(i18n.language)
  const maxIndex = size(itemImages) - 1
  const {
    fishName,
    fishPrice
  } = get(fishTypeMap, fishType, {})

  const scrollToOtherImage = (targetIndex) => {
    document.querySelector(`#${id} img[src="${itemImages[targetIndex].productImg}"]`).scrollIntoView()
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
      trigger()
    } else {
      removeListener()
    }

    return removeListener
  }, [visible, addListener, removeListener, trigger])

  if (isLoading || isMutating) {
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
        <Skeleton
          className='fixed mt-[10vh] h-[80vh] w-[100vw]'
        />
      </Model>
    )
  }

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
        key={itemSerial}
        className='bg-slate-100/50'
        items={(
          <>
            <li><span className='p-1'>{`id: ${itemSerial}`}</span></li>
            <li><span className='p-1'>{`type: ${fishName}`}</span></li>
            <li><span className='p-1'>{`price: ${fishPrice} ${t('currency')}`}</span></li>
          </>
        )}
        openIcon={LuArrowLeftFromLine}
        closeIcon={LuArrowRightFromLine}
        overlay={false}
        isRoot={false}
        rwd={false}
        defaultOpen
      >
        <div className='carousel w-full items-center rounded-none bg-slate-100 max-md:h-full md:h-[100vh]'>
          {itemImages.map((itemImage = {}, index) => {
            const {
              // zoomedImg: imgUrl,
              productImg: imgUrl
            } = itemImage
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
                <LazyImage
                  src={imgUrl}
                  className='m-auto max-h-full object-scale-down'
                  alt='Carousel component'
                  loaderClassName='translate-x-[-100%] z-0 w-[100vw] h-[80vh]'
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
