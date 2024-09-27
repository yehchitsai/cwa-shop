import { defer } from 'react-router-dom'
import getEnvVar from '../../../utils/getEnvVar'
import getAuth from '../../../components/Router/getAuth'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')

const loader = async () => {
  const [error, auth, response] = await getAuth(subPrefix)
  if (error) {
    throw response
  }

  return defer({ message: auth })
}

export default loader
