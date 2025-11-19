import { useEffect, useRef } from 'react'
import { atom, useAtom } from 'jotai'
import { useLocation } from 'react-router-dom'

const jsonBlockAtom = atom({})

const useJsonBlock = (newJsonBlockAtom = jsonBlockAtom) => {
  const result = useAtom(newJsonBlockAtom)
  const { pathname } = useLocation()
  const currentPathname = useRef()
  const [, setJsonBlock] = result

  useEffect(() => {
    if (pathname === currentPathname.current) {
      return
    }

    setJsonBlock({})
    currentPathname.current = pathname
  }, [pathname, setJsonBlock])

  return result
}

export default useJsonBlock
