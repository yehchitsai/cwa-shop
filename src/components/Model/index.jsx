import { MdOutlineClose } from 'react-icons/md'
import { isUndefined } from 'lodash-es'
import clx from 'classnames'

const Model = (props) => {
  const {
    id,
    title,
    children,
    className,
    isCloseBtnVisible = true,
    onClose
  } = props

  const onModalClose = () => onClose && onClose()

  return (
    <dialog id={id} className='modal'>
      <div
        className={clx(
          'modal-box',
          { [className]: className }
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
          <h3 className='text-lg font-bold'>{title}</h3>
        )}
        {children}
        {
          isCloseBtnVisible && (
            <div className='modal-action'>
              <form method='dialog'>
                {/* if there is a button in form, it will close the modal */}
                <button type='submit' className='btn' onClick={onModalClose}>Close</button>
              </form>
            </div>
          )
        }
      </div>
    </dialog>
  )
}

export default Model
