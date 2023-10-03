import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'
import fetcher from './utils/fetcher'
import mockFetcher from './utils/mockFetcher'
import Router from './components/Router/index.jsx'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        keepPreviousData: true,
        fetcher: window.IS_MOCK ? mockFetcher : fetcher
      }}
    >
      <Router />
    </SWRConfig>
  </React.StrictMode>
)
