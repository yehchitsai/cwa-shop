import { Suspense } from 'react'
import { get, isEmpty } from 'lodash-es'
import { useImage } from 'react-image'
import Skeleton from 'react-loading-skeleton'
import { ErrorBoundary } from 'react-error-boundary'

const fallbackRender = (props) => {
  const { error } = props
  // console.log(error)

  return (
    <div className='block w-full bg-black py-10 text-center text-white'>
      {get(error, 'message', 'Error')}
    </div>
  )
}

const ReactImage = (props) => {
  const {
    src: imageSrc, alt, className, onClick
  } = props
  const { src } = useImage({
    srcList: imageSrc
  })

  return (
    <img
      src={src}
      alt={alt}
      // crossOrigin='anonymous'
      loading='lazy'
      className={className}
      onClick={onClick}
    />
  )
}

const LazyImage = (props) => {
  const { src, style, loaderClassName } = props
  if (isEmpty(src)) {
    return (
      <div className='block w-full bg-black py-10 text-center text-white'>
        No Image
      </div>
    )
  }
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
        <ReactImage {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default LazyImage
