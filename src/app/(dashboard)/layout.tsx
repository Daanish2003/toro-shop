import DashboardNavbar from '@/components/dashboard/dashboardNavbar'
import LogoBar from '@/components/dashboard/logoBar'
import Sidebar from '@/components/dashboard/sidebar'
import React from 'react'

const DashboardLayout = ({children}: {children : string}) => {
  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_fr] lg:grid-cols-[280px_1fr]'>
      <div className='bg-muted/40 border-r hidden md:block'>
        <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px]'>
        <LogoBar />
        </div>
         <div className='flex-1'>
          <Sidebar />
         </div>
        </div>
    </div>
     <DashboardNavbar />
    </div>
  )
}

export default DashboardLayout