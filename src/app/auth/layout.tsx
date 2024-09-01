import React from 'react'

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex items-center h-screen justify-center w-screen">{children}</div>
  )
}

export default AuthLayout