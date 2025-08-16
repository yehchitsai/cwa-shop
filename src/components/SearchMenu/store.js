import { isEmpty } from 'lodash-es'
import { atom, useAtom } from 'jotai'

const isFilterMenuOpenAtom = atom(false)
const currentPhaseAtom = atom('')
const phaseAtom = atom('')
const phaseTypeAtom = atom(null)

export const useIsFilterMenuOpen = () => {
  return useAtom(isFilterMenuOpenAtom)
}

export const useCurrentPhase = () => {
  const [currentPhase, setCurrentPhase] = useAtom(currentPhaseAtom)
  const isPhaseEmpty = isEmpty(currentPhase)
  return {
    currentPhase,
    isPhaseEmpty,
    setCurrentPhase
  }
}

export const usePhase = () => {
  return useAtom(phaseAtom)
}

export const usePhaseType = () => {
  return useAtom(phaseTypeAtom)
}
