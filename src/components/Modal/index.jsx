import {
  useEffect, useCallback, useState, useImperativeHandle
} from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { isUndefined } from 'lodash-es'
import clx from 'classnames'
import wait from '../../utils/wait'

const ESC_KEY_CODE = 27

const Modal = (props) => {
  const {
    id,
    title,
    children,
    className,
    isFullSize = false,
    isOkBtnVisible = false,
    isCloseBtnVisible = true,
    onClose,
    onOpen,
    onOk,
    onVisibleChange,
    modalRef
  } = props
  const [visible, setVisible] = useState(false)

  const onModalOk = () => onOk && onOk()

  const onModalVisibleChange = useCallback(() => {
    onVisibleChange && onVisibleChange(visible)
  }, [onVisibleChange, visible])

  const onModalOpen = useCallback(() => {
    document.querySelector(`#${id}`).showModal()
    setVisible(true)
    onModalVisibleChange()
    onOpen && onOpen()
  }, [id, onOpen, onModalVisibleChange])

  const onModalClose = useCallback(() => {
    document.querySelector(`#${id}`).close()
    setVisible(false)
    onModalVisibleChange()
    onClose && onClose()
  }, [id, onClose, onModalVisibleChange])

  const onClickEsc = useCallback(async (e) => {
    if (e.keyCode !== ESC_KEY_CODE) {
      return
    }

    await wait(100)
    onModalClose()
  }, [onModalClose])

  const addListener = useCallback(
    () => document.addEventListener('keydown', onClickEsc, false),
    [onClickEsc]
  )

  const removeListener = useCallback(
    () => document.removeEventListener('keydown', onClickEsc, false),
    [onClickEsc]
  )

  useEffect(() => {
    if (visible) {
      addListener()
    } else {
      removeListener()
    }
    return removeListener
  }, [visible, addListener, removeListener, onVisibleChange])

  useImperativeHandle(modalRef, () => {
    return {
      open: onModalOpen,
      close: onModalClose,
      visible
    }
  })

  return (
    <dialog id={id} className='modal'>
      <div
        className={clx(
          'modal-box p-0',
          {
            'h-full min-h-full w-full max-w-[100vw] rounded-none max-sm:overflow-y-hidden': isFullSize
          },
          { [className]: className },
          { hidden: !visible }
        )}
      >
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button
            type='submit'
            className='btn btn-circle btn-md absolute right-2 top-2 z-10'
            onClick={onModalClose}
          >
            <MdOutlineClose size='1.5em' />
          </button>
        </form>
        {!isUndefined(title) && (
          <h3 className='px-6 pt-6 text-lg font-bold'>{title}</h3>
        )}
        {
          visible
            ? (
              <div
                className={clx(
                  'px-6',
                  { 'overflow-y-auto max-h-[65vh]': !isFullSize }
                )}
              >
                {children}
              </div>
            )
            : null
        }
        {
          (isCloseBtnVisible || isOkBtnVisible) && (
            <div className='modal-action px-6 pb-6'>
              <form method='dialog' className='space-x-2'>
                {/* if there is a button in form, it will close the modal */}
                <button type='submit' className='btn' onClick={onModalClose}>Close</button>
                <button type='submit' className='btn' onClick={onModalOk}>Ok</button>
              </form>
            </div>
          )
        }
      </div>
    </dialog>
  )
}

export default Modal
