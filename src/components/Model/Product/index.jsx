import {
  useEffect, useCallback, useState, useRef
} from 'react'
import clx from 'classnames'
// import { useTranslation } from 'react-i18next'
import { MdArrowForwardIos, MdArrowBackIosNew, MdOpenInNew } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'
import {
  delay, get, isEmpty
} from 'lodash-es'
import Slider from 'react-slick'
import useFishInfo from '../../../hooks/useFishInfo'
import LazyImage from '../../LazyImage'
import Video from '../../Video'
import Model from '../index'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ESC_KEY_CODE = 27

const SliderArrow = (props) => {
  const {
    customClassName, style, onClick, children
  } = props
  return (
    <button
      type='button'
      className={clx(
        customClassName,
        'fixed top-[46%]',
        'btn btn-circle glass btn-md text-center pl-[0.8rem] z-10'
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const getVideoJsOptions = (itemVideos) => {
  return {
    autoplay: false,
    controls: true,
    fill: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: get(itemVideos, '[0].productVideo'),
      type: 'video/mp4'
    }]
  }
}

const ProductModel = (props) => {
  const {
    id, visible, onClose, product = {}
  } = props
  const {
    // fishType,
    itemSerial
  } = product
  const {
    trigger,
    data: {
      itemVideos = [],
      itemImages = []
    } = {},
    isLoading,
    isMutating
  } = useFishInfo(itemSerial)
  const [slideIndex, setSlideIndex] = useState(0)
  const playerRef = useRef(null)
  const isVideoExist = !isEmpty(itemVideos)
  const isOpenNewTabBtnVisible = !(isVideoExist && slideIndex === 0)
  // const { i18n, t } = useTranslation()
  // const {
  //   fishTypeMap
  // } = useFishTypes(i18n.language)
  // const {
  //   fishName,
  //   fishPrice
  // } = get(fishTypeMap, fishType, {})

  const onSlideChange = (index) => {
    setSlideIndex(index)
  }

  const onPlayerReady = (player) => {
    playerRef.current = player
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
      <Slider
        className='top-[50%] translate-y-[-50%]'
        dotsClass='slick-dots bottom-[0.8rem!important]'
        prevArrow={(
          <SliderArrow customClassName='left-2'>
            <MdArrowBackIosNew size='1.5em' />
          </SliderArrow>
        )}
        nextArrow={(
          <SliderArrow customClassName='right-2'>
            <MdArrowForwardIos size='1.5em' />
          </SliderArrow>
        )}
        afterChange={onSlideChange}
        slidesToShow={1}
        slidesToScroll={1}
        speed={500}
        infinite
        dots
      >
        {!isEmpty(itemVideos) && (
          <div className='max-h-[100vh] max-w-full'>
            <div className='m-auto max-w-screen-lg'>
              <Video
                options={getVideoJsOptions(itemVideos)}
                onReady={onPlayerReady}
              />
            </div>
          </div>
        )}
        {itemImages.map((itemImage = {}, index) => {
          const {
            productImg: imgUrl
          } = itemImage
          return (
            <div className='h-[90vh]' key={index}>
              <div className='max-sm:flex max-sm:h-[90vh]'>
                <LazyImage
                  src={imgUrl}
                  key={imgUrl}
                  className='m-auto max-h-screen object-scale-down'
                  alt='Carousel component'
                  loaderClassName='translate-x-[-100%] z-0 w-[100vw] h-[80vh]'
                />
              </div>
            </div>
          )
        })}
      </Slider>
      {isOpenNewTabBtnVisible && (
        <a
          target='_blank'
          rel='noreferrer noopener'
          className='btn btn-circle fixed bottom-2 right-2'
          href={`${get(itemImages, `${slideIndex + (isVideoExist ? 1 : 0)}.zoomedImg`)}`}
        >
          <MdOpenInNew size='1.5rem' />
        </a>
      )}
    </Model>
  )
}

export default ProductModel
