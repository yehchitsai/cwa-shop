import { SWRConfig } from 'swr'
import { Provider } from 'jotai'
import { Toaster } from 'react-hot-toast'
import fetcher from '../../utils/fetcher'
import '../../i18n'
import '../../index.css'

const Root = (props) => {
  const { children } = props
  return (
    <>
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
        <Provider>
          {children}
        </Provider>
      </SWRConfig>
      <Toaster />
    </>
  )
}

export default Root
