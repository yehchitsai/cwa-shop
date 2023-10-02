import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import clx from 'classnames'
import { isUndefined } from 'lodash-es'

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
    bottomItems,
    openIcon: OpenIcon,
    closeIcon: CloseIcon = MdOutlineClose,
    overlay = false,
    indicator = false,
    defaultOpen = false,
    isRoot = false,
    rwd = true,
    className
  } = props
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isBottomItemsExist = !isUndefined(bottomItems)

  return (
    <div
      className={clx(
        'drawer drawer-end max-sm:h-full',
        { 'lg:drawer-open': rwd }
      )}
    >
      <input
        id={id}
        type='checkbox'
        className='drawer-toggle'
        defaultChecked={defaultOpen}
      />
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
          'drawer-side max-sm:flex max-sm:flex-wrap',
          { 'md:top-[69px] md:h-[calc(100vh-69px)] z-10': isRoot }
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
            'menu max-sm:w-full sm:w-80 bg-base-200 p-4 text-base-content',
            { 'h-[70%]': isBottomItemsExist },
            { 'h-full': !isBottomItemsExist },
            { [className]: className }
          )}
        >
          {/* Sidebar content here */}
          <li
            className={clx(
              'max-lg:mb-14',
              { 'mb-14': !isRoot }
            )}
          >
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
        {
          isBottomItemsExist && (
            <ul
              className={clx(
                'menu h-[30%] max-sm:w-full sm:w-80 bg-base-200 p-4 text-base-content relative max-lg:top-[70%] max-sm:top-auto lg:top-auto',
                { [className]: className }
              )}
            >
              {bottomItems}
            </ul>
          )
        }
      </div>
    </div>
  )
}

export default Drawer
