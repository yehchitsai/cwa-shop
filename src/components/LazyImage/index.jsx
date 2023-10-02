import { useImage } from 'react-image'
import Skeleton from 'react-loading-skeleton'

const LazyImage = (props) => {
  const {
    src: imageSrc, alt, style, className, loaderClassName
  } = props
  const { src, isLoading } = useImage({
    srcList: imageSrc
  })

  if (isLoading) {
    return (
      <Skeleton
        style={{ display: 'block', ...style }}
        className={loaderClassName}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      crossOrigin='anonymous'
      loading='lazy'
      className={className}
    />
  )
}

export default LazyImage
