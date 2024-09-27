import { defer } from 'react-router-dom'
import clearExpiredLoginToken from '../../../utils/clearExpiredLoginToken'
import getAuth from '../../../components/Router/getAuth'
import subPrefix from '../layout/subPrefix'

clearExpiredLoginToken()

const loader = async () => {
  const [error, auth, response] = await getAuth(subPrefix)
  if (error) {
    throw response
  }

  return defer({
    auth
  })
}

export default loader
