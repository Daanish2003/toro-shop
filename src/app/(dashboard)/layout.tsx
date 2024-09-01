import Navbar from '@/components/navbar'
import React from 'react'

const DashboardLayout = ({children}: {children : string}) => {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default DashboardLayout