import { AlertProvider } from './hooks/useMessageWrapper'
import AlertMessage from './hooks/useMessage'
import { router } from './pages/router'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <AlertProvider>
      <RouterProvider router={router}></RouterProvider>
      <AlertMessage></AlertMessage>
    </AlertProvider>
  )
}

export default App
