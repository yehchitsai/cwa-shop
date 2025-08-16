import { MdChat, MdClose, MdSend } from 'react-icons/md'
import clx from 'classnames'
import { motion, AnimatePresence } from 'motion/react'
import { atom, useAtom } from 'jotai'
import { useHotkeys } from 'react-hotkeys-hook'

const openAtom = atom(null)
const Chat = () => {
  const [isOpen, setIsOpen] = useAtom(openAtom)

  // Close chat with ESC
  useHotkeys('esc', () => {
    if (!isOpen) {
      return
    }

    setIsOpen(false)
  }, [isOpen])

  return (
    <>
      <button
        type='button'
        className={clx(
          'btn btn-square border-2! border-gray-400 shadow-lg! bottom-2 left-2 fixed'
        )}
        onClick={() => setIsOpen(true)}
      >
        <MdChat size='2em' />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom left' }}
            className={`
              fixed bottom-0 left-0 z-50 flex size-full flex-col overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-xl
              sm:h-[500px] sm:w-96 md:bottom-2 md:left-2
            `}
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
            <div className='flex-1 space-y-4 overflow-y-auto p-4'>
              <div className='chat chat-start'>
                <div className='chat-bubble'>Hey! 👋</div>
              </div>
              <div className='chat chat-end'>
                <div className='chat-bubble'>Hello there! 😃</div>
              </div>
            </div>

            {/* Input */}
            <div className='flex items-center gap-2 border-t border-base-300 bg-base-200 p-2'>
              <input
                type='text'
                placeholder='Type a message…'
                className='input input-bordered flex-1 leading-4'
              />
              <button
                className='btn btn-square btn-ghost btn-sm'
                type='button'
              >
                <MdSend size='1.5em' />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chat
