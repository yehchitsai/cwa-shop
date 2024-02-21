// mp4 mov type `video/mp4`
// https://github.com/videojs/video.js/blob/v8.11.3/src/js/utils/mimetypes.js#L13-L14
const type = 'video/mp4'

const getVideoJsOptions = (options) => {
  const { src } = options
  return {
    autoplay: false,
    controls: true,
    fill: true,
    responsive: true,
    fluid: true,
    sources: [{
      src,
      type
    }]
  }
}

export default getVideoJsOptions
