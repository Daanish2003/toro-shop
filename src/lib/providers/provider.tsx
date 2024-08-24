import React from 'react'
import AuthProvider from './authProvider'

const Provider = ({children}: {children : React.ReactNode}) => {
  return (
    <AuthProvider>{children}</AuthProvider>
  )
}

export default Provider