import { defer } from 'react-router-dom'
import getAuth from '../../../components/Router/getAuth'
import subPrefix from './subPrefix'

const loader = async () => {
  const [error, auth, response] = await getAuth(subPrefix)
  if (error) {
    throw response
  }

  return defer({ message: auth })
}

export default loader
