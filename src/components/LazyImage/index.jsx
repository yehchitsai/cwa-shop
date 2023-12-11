import { Suspense } from 'react'
import { isEmpty } from 'lodash-es'
import { useImage } from 'react-image'
import Skeleton from 'react-loading-skeleton'
import { ErrorBoundary } from 'react-error-boundary'

const fallbackRender = (props) => {
  const { error } = props
  return (
    <div className='block w-full bg-black py-10 text-center text-white'>
      <pre>{error.message}</pre>
    </div>
  )
}

const Image = (props) => {
  const {
    src: imageSrc, alt, style, className, loaderClassName, onClick
  } = props
  const { src } = useImage({
    srcList: imageSrc
  })

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Suspense
        fallback={(
          <Skeleton
            style={{ display: 'block', ...style }}
            className={loaderClassName}
          />
        )}
      >
        <img
          src={src}
          alt={alt}
          crossOrigin='anonymous'
          loading='lazy'
          className={className}
          onClick={onClick}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

const LazyImage = (props) => {
  const { src } = props
  if (isEmpty(src)) {
    return (
      <div className='block w-full bg-black py-10 text-center text-white'>
        No Image
      </div>
    )
  }
  return (
    <Image {...props} />
  )
}

export default LazyImage
