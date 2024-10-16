import {
  useEffect, useCallback, useState, useImperativeHandle
} from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { isUndefined } from 'lodash-es'
import clx from 'classnames'
import wait from '../../utils/wait'

const ESC_KEY_CODE = 27

const ModalActions = (props) => {
  const {
    onModalClose,
    onModalOk,
    className,
    closeText,
    okText
  } = props
  return (
    <div
      className={clx(
        'modal-action px-6 pb-6 space-x-2',
        { [className]: className }
      )}
    >
      <button type='button' className='btn' onClick={onModalClose}>
        {closeText}
      </button>
      <button type='submit' className='btn' onClick={() => onModalOk && onModalOk()}>
        {okText}
      </button>
    </div>
  )
}

const Modal = (props) => {
  const {
    id,
    title,
    children,
    className,
    isFullSize = false,
    isOkBtnVisible = false,
    isCloseBtnVisible = true,
    isFormModal = false,
    onClose,
    onOpen,
    onOk,
    onVisibleChange,
    modalRef,
    okText = 'Ok',
    closeText = 'Close'
  } = props
  const [visible, setVisible] = useState(false)

  const onModalOk = async () => {
    if (onOk) {
      await Promise.resolve(onOk())
    }
    document.querySelector(`#${id}`).close()
  }

  const onModalVisibleChange = useCallback(() => {
    onVisibleChange && onVisibleChange(visible)
  }, [onVisibleChange, visible])

  const onModalOpen = useCallback(() => {
    document.querySelector(`#${id}`).showModal()
    setVisible(true)
    onModalVisibleChange()
    onOpen && onOpen()
    wait(0).then(() => {
      document.querySelector(`#${id}-body`).scrollTop = 0
    })
  }, [id, onOpen, onModalVisibleChange])

  const onModalActionClose = useCallback(() => {
    document.querySelector(`#${id}`).close()
    setVisible(false)
    onModalVisibleChange()
    onClose && onClose()
  }, [id, onClose, onModalVisibleChange])

  const onModalClose = useCallback(() => {
    document.querySelector(`#${id}`).close()
    setVisible(false)
    onModalVisibleChange()
  }, [id, onModalVisibleChange])

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
            type='button'
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
                id={`${id}-body`}
                className={clx(
                  'px-6',
                  { 'overflow-y-auto': !isFullSize },
                  { 'overflow-x-hidden': !isFullSize },
                  { 'max-h-[65vh]': !isFormModal },
                  { 'max-sm:max-h-[70vh] sm:max-h-[80vh]': isFormModal }
                )}
              >
                {!isFormModal && children}
                {
                  isFormModal && children(
                    <>
                      <ModalActions
                        className='absolute bottom-0 right-0 z-10 w-full bg-base-100 pt-6'
                        onModalClose={onModalActionClose}
                        okText={okText}
                        closeText={closeText}
                      />
                      <div className='max-sm:h-[10vh] sm:h-[15vh]' />
                    </>
                  )
                }
              </div>
            )
            : null
        }
        {
          (!isFormModal && (isCloseBtnVisible || isOkBtnVisible)) && (
            <ModalActions
              onModalClose={onModalActionClose}
              onModalOk={onModalOk}
              okText={okText}
              closeText={closeText}
            />
          )
        }
      </div>
    </dialog>
  )
}

export default Modal
