import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Router from './components/Router/index.jsx'
import SkeletonHome from './components/Skeleton/Home.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<SkeletonHome />}>
      <Router />
    </Suspense>
  </React.StrictMode>
)
