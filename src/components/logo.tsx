import { Bell, Package2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Logo = () => {
  return (
    <>
      <Link href="/" className='items-center gap-2 font-semibold flex'>
        <Package2 className='h-6 w-6' />
        <span>TORO-SHOP</span>
    </Link>
    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
    </Button>
    </>
  )
}

export default Logo