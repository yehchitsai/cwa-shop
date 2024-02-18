import {
  useState, useRef
} from 'react'
import clx from 'classnames'
// import { useTranslation } from 'react-i18next'
import { MdArrowForwardIos, MdArrowBackIosNew, MdOpenInNew } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'
import {
  get, isEmpty
} from 'lodash-es'
import Slider from 'react-slick'
import wait from '../../../utils/wait'
import useFishInfo from '../../../hooks/useFishInfo'
import LazyImage from '../../LazyImage'
import Video from '../../Video'
import getVideoJsOptions from '../../Video/getVideoJsOptions'
import Modal from '../index'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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

const getOptions = (itemVideos) => {
  const src = get(itemVideos, '[0].productVideo')
  return getVideoJsOptions({ src })
}

const ProductModal = (props) => {
  const {
    modalRef, id, onClose, product = {}
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
  const largeImgUrl = get(itemImages, `${slideIndex - (isVideoExist ? 1 : 0)}.zoomedImg`, '')
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

  const onOpen = async () => {
    await wait(0)
    trigger()
    setSlideIndex(0)
  }

  if (isLoading || isMutating) {
    return (
      <Modal
        modalRef={modalRef}
        id={id}
        isCloseBtnVisible={false}
        onClose={onClose}
        onOpen={onOpen}
        isFullSize
      >
        <Skeleton
          className='absolute left-0 top-[20vh] h-[60vh] w-full'
        />
      </Modal>
    )
  }

  return (
    <Modal
      modalRef={modalRef}
      id={id}
      onClose={onClose}
      onOpen={onOpen}
      isCloseBtnVisible={false}
      isFullSize
    >
      <Slider
        className='translate-y-[6%]'
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
          <div className='max-sm:max-h-[80vh] sm:max-h-full max-w-full'>
            <div className='m-auto max-w-screen-lg'>
              <Video
                options={getOptions(itemVideos)}
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
            <div className='h-[80vh]' key={index}>
              <div className='max-sm:flex max-sm:h-[80vh]'>
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
          href={largeImgUrl}
        >
          <MdOpenInNew size='1.5rem' />
        </a>
      )}
    </Modal>
  )
}

export default ProductModal
