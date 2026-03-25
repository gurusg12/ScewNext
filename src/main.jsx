import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { BrowserRouter } from 'react-router-dom'

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
        <App />
    </BrowserRouter>
)
