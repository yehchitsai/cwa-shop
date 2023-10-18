import React from 'react'
import { SWRConfig } from 'swr'
import { RecoilRoot } from 'recoil'
import fetcher from '../../utils/fetcher'
import '../../i18n'
import '../../index.css'

const Root = (props) => {
  const { children } = props
  return (
    <React.StrictMode>
      <SWRConfig
        value={{
          // https://swr.vercel.app/docs/api
          keepPreviousData: true,
          errorRetryCount: 3,
          suspense: false,
          fetcher
        }}
      >
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </SWRConfig>
    </React.StrictMode>
  )
}

export default Root
