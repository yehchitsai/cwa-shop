import PQueue from 'p-queue'

const defaultQueueOptions = {
  // chrome request maximum 5, keep 1 request free for other request
  concurrency: 5
}

const useQueue = (queueOptions = defaultQueueOptions) => {
  const queue = new PQueue(queueOptions)
  const controller = new AbortController()

  return { queue, controller }
}

export default useQueue
