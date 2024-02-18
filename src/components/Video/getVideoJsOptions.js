const getVideoJsOptions = (options) => {
  const { src, type = 'video/mp4' } = options
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
