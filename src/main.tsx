import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { SidebarProvider } from './components/ui/sidebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <SidebarProvider>
    <App />
    </SidebarProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
