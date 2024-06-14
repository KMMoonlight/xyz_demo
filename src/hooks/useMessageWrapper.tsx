import React, { createContext, useState } from 'react'

interface IAlert {
  alert: {
    type: string
    message: string
    visible: boolean
  }
  showAlert: (
    message: string,
    type: 'warning' | 'success' | 'info' | 'error'
  ) => void
}

export const AlertContext = createContext<IAlert>({} as IAlert)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState({
    type: 'success',
    message: '',
    visible: false,
  })

  const showAlert = (
    message: string,
    type: 'warning' | 'success' | 'info' | 'error'
  ) => {
    setAlert({ message, type, visible: true })
    setTimeout(() => {
      closeAlert()
    }, 2000)
  }

  const closeAlert = () => {
    setAlert({ ...alert, visible: false })
  }

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      <div className="relative">{children}</div>
    </AlertContext.Provider>
  )
}
