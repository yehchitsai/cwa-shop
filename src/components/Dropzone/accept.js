// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const ACCEPT = {
  IMAGE: {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg']
  },
  VIDEO: {
    'video/mp4': ['.mp4'],
    'video/mov': ['.mov']
  },
  EXCEL: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  }
}

export default ACCEPT
