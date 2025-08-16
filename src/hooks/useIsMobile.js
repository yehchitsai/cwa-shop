import { useState } from 'react'
import { useEventListener } from '@react-hooks-library/core'

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < breakpoint)
  }

  useEventListener('resize', checkIsMobile)

  return isMobile
}

export default useIsMobile
