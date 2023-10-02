import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import clx from 'classnames'

const withBadgeBtn = (indicator, isRoot, component) => {
  if (!indicator) {
    return component
  }

  return (
    <div className='indicator fixed bottom-2 right-2'>
      <span
        className={clx(
          'badge indicator-item badge-secondary bottom-2 right-2',
          { absolute: !isRoot },
          { fixed: isRoot }
        )}
      >
        {indicator}
      </span>
      {component}
    </div>
  )
}

const Drawer = (props) => {
  const {
    id,
    children,
    items,
    openIcon: OpenIcon,
    closeIcon: CloseIcon = MdOutlineClose,
    overlay = false,
    indicator = false,
    isRoot = false,
    rwd = true,
    className
  } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={clx(
        'drawer drawer-end h-full',
        { 'lg:drawer-open': rwd }
      )}
    >
      <input id={id} type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        {children}
        {withBadgeBtn(
          indicator,
          isRoot,
          (
            <label
              htmlFor={id}
              className={clx(
                'btn btn-square glass btn-outline drawer-button bottom-2 right-2',
                { absolute: !isRoot },
                { fixed: isRoot },
                { 'lg:hidden': rwd },
                { hidden: isOpen }
              )}
              onClick={() => setIsOpen(true)}
            >
              <OpenIcon size='2em' />
            </label>
          )
        )}
      </div>
      <div
        className={clx(
          'drawer-side',
          { 'fixed top-[69px] h-[calc(100%-69px)]': isRoot }
        )}
      >
        {
          overlay && (
            <label
              htmlFor={id}
              aria-label='close sidebar'
              className={clx(
                'drawer-overlay',
                { 'lg:hidden': rwd }
              )}
              onClick={() => setIsOpen(false)}
            />
          )
        }
        <ul
          className={clx(
            'menu min-h-full w-80 bg-base-200 p-4 text-base-content',
            { [className]: className }
          )}
        >
          {/* Sidebar content here */}
          <li className='max-lg:mb-14'>
            <label
              htmlFor={id}
              className={clx(
                'btn btn-square btn-outline drawer-button absolute left-2',
                { 'lg:hidden': rwd }
              )}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon size='2em' />
            </label>
          </li>
          {items}
        </ul>
      </div>
    </div>
  )
}

export default Drawer
