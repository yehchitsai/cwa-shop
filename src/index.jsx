import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'
import { RecoilRoot } from 'recoil'
import fetcher from './utils/fetcher'
import Router from './components/Router/index.jsx'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
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
        <Router />
      </RecoilRoot>
    </SWRConfig>
  </React.StrictMode>
)
