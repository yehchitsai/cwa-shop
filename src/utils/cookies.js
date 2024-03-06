import cookiejs from 'js-cookie'

cookiejs.withAttributes({
  domain: window.location.hostname,
  sameSite: 'strict',
  secure: true
})

export default cookiejs
