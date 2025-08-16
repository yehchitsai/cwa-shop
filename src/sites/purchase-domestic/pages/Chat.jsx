import { MdChat } from 'react-icons/md'
import clx from 'classnames'
import { motion, AnimatePresence } from 'motion/react'
import { atom, useAtom } from 'jotai'

const openAtom = atom(null)
const Chat = () => {
  const [isOpen, setIsOpen] = useAtom(openAtom)
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
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`
              fixed bottom-4 left-4 z-40 size-full overflow-hidden rounded-2xl border border-base-300 bg-base-100
              shadow-xl sm:h-[500px] sm:w-96
            `}
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-base-300 bg-base-200 p-3'>
              <span className='font-semibold'>Chat Room</span>
              <button
                className='btn btn-ghost btn-xs'
                type='button'
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Messages */}
            <div className='h-[calc(100%-7rem)] space-y-4 overflow-y-auto p-4'>
              <div className='chat chat-start'>
                <div className='chat-bubble'>Hey! 👋</div>
              </div>
              <div className='chat chat-end'>
                <div className='chat-bubble'>Hello there! 😃</div>
              </div>
            </div>

            {/* Input */}
            <div className='flex gap-2 border-t border-base-300 bg-base-200 p-3'>
              <input
                type='text'
                placeholder='Type a message…'
                className='input input-bordered flex-1'
              />
              <button
                className='btn btn-primary'
                type='button'
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chat
