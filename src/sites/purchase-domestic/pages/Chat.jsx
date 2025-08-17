import {
  useMemo, useRef, useState, useEffect, useCallback
} from 'react'
import { Link } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { MdChat, MdClose, MdSend } from 'react-icons/md'
import clx from 'classnames'
import { motion } from 'motion/react'
import { useAtom } from 'jotai'
import { Formik, Form, Field } from 'formik'
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears
} from 'date-fns'
import { get, isEmpty, size } from 'lodash-es'
import safeAwait from 'safe-await'
import * as Yup from 'yup'
import wait from '../../../utils/wait'
import useChatHistory from '../../../hooks/useChatHistory'
import LazyImage from '../../../components/LazyImage'
import useIsMobile from '../../../hooks/useIsMobile'
import chatAtom from '../../../state/chat'
import useCreateRecommendations from '../../../hooks/useCreateRecommendations'
import { usePhase, usePhaseType } from '../../../components/SearchMenu/store'

const formatChatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()

  const mins = differenceInMinutes(now, date)
  if (mins < 1) {
    return '剛剛'
  }
  if (mins < 60) {
    return `${mins} 分鐘前`
  }

  const hours = differenceInHours(now, date)
  if (hours < 24) {
    return `${hours} 小時`
  }

  const days = differenceInDays(now, date)
  if (days < 30) {
    return `${days} 天前`
  }

  const months = differenceInMonths(now, date)
  if (months < 12) {
    return `${months} 個月前`
  }

  const years = differenceInYears(now, date)
  return `${years} 年前`
}

const scrollToBottom = async (ref, smooth = false) => {
  if (!ref.current) {
    return
  }

  await wait(100)
  const el = ref.current
  const chats = el.querySelectorAll(smooth ? '.chat-end' : '.chat-start')
  const lastChat = chats[chats.length - 1] || null
  if (!lastChat) {
    return
  }

  lastChat.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: smooth ? 'start' : 'end' })
}

const FORM = {
  QUERY: 'query'
}

const FORM_VALUES = {
  [FORM.QUERY]: ''
}

const validationSchema = Yup.object().shape({
  [FORM.QUERY]: Yup.string().required('請輸入詢問內容')
})

const Chat = () => {
  const [tmpFormValues, setTmpFormValues] = useState(null)
  const tmpPhaseRef = useRef(null)
  const messagesRef = useRef(null)
  const resetBtn = useRef()
  const [isOpen, setIsOpen] = useAtom(chatAtom)
  const isMobile = useIsMobile()
  const {
    isMutating, isError, trigger
  } = useCreateRecommendations()
  const {
    data, isLoading, addHistory, updateHistoryById
  } = useChatHistory({
    onSuccess: () => {
      if (!isOpen) {
        return
      }

      scrollToBottom(messagesRef)
    }
  })
  const [phase, setPhase] = usePhase()
  const [phaseType] = usePhaseType()
  const lastChatIndex = useMemo(() => size(data) - 1, [data])

  const onOpen = () => {
    setIsOpen(true)
    scrollToBottom(messagesRef)
  }

  const clearForm = () => {
    resetBtn.current.click()
  }

  const onSubmit = useCallback(async (formValues, options = {}) => {
    if (isMutating) {
      return false
    }

    const { skipFormUpdate } = options
    console.log(formValues)
    if (!skipFormUpdate) {
      clearForm()
      setTmpFormValues(formValues)
      addHistory({
        question: formValues[FORM.QUERY]
      })
    }

    const postParams = {
      body: formValues
    }
    wait(100).then(() => scrollToBottom(messagesRef))
    const [createError, result = {}] = await safeAwait(trigger(postParams))
    const isSuccess = get(result, 'success', false)
    if (createError || !isSuccess) {
      await updateHistoryById({ response: '發生錯誤，請稍候再嘗試' })
      scrollToBottom(messagesRef, true)
      return false
    }

    await updateHistoryById(result)
    setTmpFormValues(null)
    scrollToBottom(messagesRef, true)
    return isSuccess
  }, [addHistory, trigger, updateHistoryById, isMutating])

  const onClickUUID = () => {
    if (!isMobile) {
      return
    }

    setIsOpen(false)
  }

  const retry = async () => {
    const isSuccess = await onSubmit(tmpFormValues, {
      skipFormUpdate: true
    })
    if (!isSuccess) {
      return
    }

    scrollToBottom(messagesRef)
  }

  // Close chat with ESC
  useHotkeys('esc', () => {
    if (!isOpen) {
      return
    }

    setIsOpen(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isEmpty(phase) || (phaseType !== 'ai') || (tmpPhaseRef.current === phase)) {
      return
    }

    tmpPhaseRef.current = phase
    onSubmit({ [FORM.QUERY]: phase })
    setPhase('')
  }, [isOpen, phase, phaseType, onSubmit, setPhase])

  return (
    <>
      <button
        type='button'
        className={clx(
          'btn btn-square border-2! border-gray-400 shadow-lg! bottom-2 left-2 fixed'
        )}
        onClick={onOpen}
      >
        <MdChat size='2em' />
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={
          isOpen
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.3 }
        }
        transition={{ duration: 0.1, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom left' }}
        className={clx(`
          fixed bottom-0 left-0 z-50 flex size-full flex-col overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-xl
          sm:h-[500px] sm:w-96 md:bottom-2 md:left-2
        `, { hidden: !isOpen })}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-base-300 bg-base-200 p-3'>
          <span className='font-semibold'>AI 導購</span>
          <button
            className='btn btn-square btn-ghost btn-sm'
            type='button'
            onClick={() => setIsOpen(false)}
          >
            <MdClose size='1.5em' />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className={clx('flex-1 space-y-4 overflow-y-auto p-4', {
            'skeleton rounded-none [&_*]:invisible': isLoading
          })}
        >
          {data.map((chat, index) => {
            const { question, lastUpdatedAt, reply = {} } = chat
            const { response, results = [] } = reply
            const isLastIndex = lastChatIndex === index
            const isLastChatLoading = isLastIndex && isMutating
            return (
              <div
                key={index}
                className='contents'
              >
                <div className='chat chat-end'>
                  <div className='chat-header'>
                    <time className='text-xs opacity-50'>
                      {formatChatTime(lastUpdatedAt)}
                    </time>
                  </div>
                  <div className='chat-bubble'>
                    {question}
                  </div>
                  <div
                    className={clx('chat-footer my-2 hidden', {
                      '!block': isError && isLastIndex
                    })}
                  >
                    <button
                      type='button'
                      onClick={retry}
                      className='btn btn-sm'
                      disabled={isMutating}
                    >
                      重試
                    </button>
                  </div>
                </div>
                <div className='chat chat-start'>
                  <div className='chat-header'>
                    <time className='text-xs opacity-50'>
                      {formatChatTime(lastUpdatedAt)}
                    </time>
                  </div>
                  {isLastChatLoading && (
                    <div className='chat-bubble'>
                      <span className='loading loading-dots' />
                    </div>
                  )}
                  {!isLastChatLoading && (
                    <div className='chat-bubble'>
                      {response}
                    </div>
                  )}
                  {!isEmpty(results) && (
                    <div className='chat-footer my-2 flex w-full flex-row gap-2 overflow-y-auto whitespace-nowrap rounded-md bg-gray-200 p-2'>
                      {results.map((result) => {
                        const {
                          name = '', description = '', uuid, image
                        } = result
                        return (
                          <Link
                            key={uuid}
                            className='flex flex-col gap-2 rounded-sm bg-white p-2'
                            to={`?uuid=${uuid}`}
                            onClick={onClickUUID}
                            viewTransition
                          >
                            <div className='flex w-60 items-center justify-center gap-2'>
                              <LazyImage
                                src={image}
                                className='size-24 rounded-md object-contain'
                                alt={`${name} 圖片`}
                              />
                              <div className='flex flex-1 flex-col'>
                                <span className='text-gray-500 opacity-60'>Search</span>
                                <span className='line-clamp-3 whitespace-break-spaces break-all'>
                                  {name}
                                </span>
                              </div>
                            </div>
                            <div className='line-clamp-5 whitespace-break-spaces break-all'>
                              {description}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <Formik
          initialValues={FORM_VALUES}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className='flex items-center gap-2 border-t border-base-300 bg-base-200 p-2'>
              <Field
                name={FORM.QUERY}
                placeholder='請輸入對話以查詢'
                className='input input-bordered flex-1 leading-4'
                // disabled={isLoading || isMutating}
                autoComplete='off'
              />
              <button
                className='btn btn-square btn-ghost btn-sm'
                type='submit'
                disabled={isLoading || isMutating}
              >
                <MdSend size='1.5em' />
              </button>
              <button
                ref={resetBtn}
                type='reset'
                className='hidden'
              >
                reset
              </button>
            </div>
          </Form>
        </Formik>
      </motion.div>
    </>
  )
}

export default Chat
