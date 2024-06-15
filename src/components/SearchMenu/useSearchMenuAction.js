import { useState } from 'react'
import { isEmpty } from 'lodash-es'

const useSearchMenuAction = () => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('')
  const [phase, setPhase] = useState('')
  const [phaseType, setPhaseType] = useState(null)
  const isPhaseEmpty = isEmpty(currentPhase)

  return {
    phase,
    setPhase,
    currentPhase,
    setCurrentPhase,
    phaseType,
    setPhaseType,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    isPhaseEmpty
  }
}

export default useSearchMenuAction
