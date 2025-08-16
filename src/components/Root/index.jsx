import { SWRConfig } from 'swr'
import { Provider, createStore } from 'jotai'
import { Toaster } from 'react-hot-toast'
import fetcher from '../../utils/fetcher'
import '../../i18n'
import '../../index.css'

const shareStore = createStore()

const Root = (props) => {
  const { children } = props
  return (
    <Provider store={shareStore}>
      <SWRConfig
        value={{
          // https://swr.vercel.app/docs/api
          revalidateOnFocus: false,
          keepPreviousData: true,
          errorRetryCount: 3,
          suspense: false,
          fetcher
        }}
      >
        {children}
      </SWRConfig>
      <Toaster />
    </Provider>
  )
}

export default Root
