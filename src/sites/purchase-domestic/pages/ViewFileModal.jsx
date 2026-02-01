import {
  useState, useRef
} from 'react'
import clx from 'classnames'
import { MdArrowForwardIos, MdArrowBackIosNew, MdOpenInNew } from 'react-icons/md'
import {
  get
} from 'lodash-es'
import Slider from 'react-slick'
import wait from '../../../utils/wait'
import LazyImage from '../../../components/LazyImage'
import Video from '../../../components/Video'
import getVideoJsOptions from '../../../components/Video/getVideoJsOptions'
import Modal from '../../../components/Modal'
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
        'btn btn-circle glass btn-md flex items-center justify-center z-10',
        '[&_svg]:relative [&_svg]:left-2'
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

const ViewFileModal = (props) => {
  const {
    modalRef,
    id,
    onClose,
    selectedRow = {}
  } = props
  const {
    video_links: videos = [],
    image_links: images = []
  } = selectedRow
  const [, setSlideIndex] = useState(0)
  const playerRef = useRef(null)

  const onSlideChange = (index) => {
    setSlideIndex(index)
  }

  const onPlayerReady = (player) => {
    playerRef.current = player
  }

  const onOpen = async () => {
    await wait(0)
    setSlideIndex(0)
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
        {videos.map((video, index) => {
          return (
            <div
              className='max-w-full max-sm:h-[80vh] sm:max-h-full'
              key={`video-${index}`}
            >
              <div className='m-auto max-w-screen-lg'>
                <Video
                  options={getOptions([{ productVideo: video }])}
                  onReady={onPlayerReady}
                />
              </div>
            </div>
          )
        })}
        {images.map((image, index) => {
          return (
            <div
              className='h-[80vh]'
              key={`image-${index}`}
            >
              <div className='max-sm:flex max-sm:h-[75vh]'>
                <LazyImage
                  src={image}
                  key={image}
                  className='m-auto max-h-screen object-scale-down'
                  alt='Carousel component'
                  loaderClassName='translate-x-[-100%] z-0 w-[100vw] h-[80vh]'
                />
              </div>
              <a
                target='_blank'
                rel='noreferrer noopener'
                className='btn btn-circle fixed bottom-2 right-2'
                href={image}
              >
                <MdOpenInNew size='1.5rem' />
              </a>
            </div>
          )
        })}
      </Slider>
    </Modal>
  )
}

export default ViewFileModal
