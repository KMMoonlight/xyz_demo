import { createBrowserRouter } from 'react-router-dom'
import Login from './Login/index'
import Home from './Home/index'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Home />,
  },
])
