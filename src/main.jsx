import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App, isAdminRoute, renderAdminDashboardIfNeeded } from './App.jsx'

if (isAdminRoute()) {
  window.location.hash = '#admin'
  renderAdminDashboardIfNeeded()
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

window.addEventListener('hashchange', () => {
  if (isAdminRoute()) renderAdminDashboardIfNeeded()
  else window.location.reload()
})

setTimeout(renderAdminDashboardIfNeeded, 0)
