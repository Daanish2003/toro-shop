"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from '../navbar'

const LayoutProvider = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
  return (
    <>
      {pathname === "/" ? (<Navbar />) : (<></>)}
      {children}
    </>
  )
}

export default LayoutProvider