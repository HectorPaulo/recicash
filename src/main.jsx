import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DevSupport } from "@react-buddy/ide-toolbox"
import { ComponentPreviews } from "./dev"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevSupport ComponentPreviews={ComponentPreviews}
                useInitialHook={() => ({
                  loading: false,
                  error: false
                })}>
      <App />
    </DevSupport>
  </StrictMode>
)