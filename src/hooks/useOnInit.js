/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

const useOnInit = (callback) => {
  useEffect(
    callback,
    []
  )
}

export default useOnInit
