import useSWR from 'swr'
import { get } from 'lodash-es'
import { useMemo } from 'react'
import { atom, useAtom } from 'jotai'
import { formatISO } from 'date-fns'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import wait from '../utils/wait'

const chatIdsAtom = atom([])
const newHistoryAtom = atom([])

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const url = `${awsHostPrefix}/chathistory`

const useChatHistory = (options = {}) => {
  const [, setChatId] = useAtom(chatIdsAtom)
  const [newHistory, setNewHistory] = useAtom(newHistoryAtom)
  const {
    data = {}, error, isValidating, isLoading
  } = useSWR(() => ({ url, host }), {
    suspense: false,
    ...options
  })
  const apiRecords = get(data, 'records', [])
  const history = useMemo(() => {
    const apiHistory = apiRecords.map((item, index) => {
      return { ...item, index }
    })
    return [...apiHistory, ...newHistory]
  }, [apiRecords, newHistory])

  const addHistory = (newItem = {}) => {
    const newChatId = Date.now()
    setChatId(newChatId)
    const nextNewHistory = [
      ...newHistory,
      { ...newItem, id: newChatId, lastUpdatedAt: formatISO(Date.now()) }
    ]
    setNewHistory(nextNewHistory)
  }

  const updateHistoryById = async (newItem) => {
    setChatId((currentChatId) => {
      setNewHistory((items) => {
        const newItems = items.map((item) => {
          if (item.id === currentChatId) {
            return { ...item, reply: newItem }
          }

          return item
        })
        return newItems
      })
      return currentChatId
    })
    return wait(100)
  }

  return {
    data: history,
    addHistory,
    updateHistoryById,
    isLoading: isValidating || isLoading,
    error
  }
}

export default useChatHistory
