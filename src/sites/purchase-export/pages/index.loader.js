import { defer } from 'react-router-dom'
import clearExpiredLoginToken from '../../../utils/clearExpiredLoginToken'
import getAuth from '../../../components/Router/getAuth'

clearExpiredLoginToken()

const loader = async () => {
  const [error, auth, response] = await getAuth()
  if (error) {
    throw response
  }

  return defer({
    auth
  })
}

export default loader
