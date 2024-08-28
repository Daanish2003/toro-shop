"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import logout from '@/actions/logout'
import { useSession } from './provider/sessionProvider'
import { Button } from './ui/button'




const Navbar = () => {
  const session = useSession()

  const signOut = async () => {
    await logout()
  }
  return (
    <nav className="px-12 h-16 flex justify-between items-center border-b border-b-gray-500">
        <h1 className='text-2xl font-bold'>TORO-SHOP</h1>
        <div className="flex gap-x-6">
          { session ? (
              <>
                 <Button onClick={signOut}>Logout</Button>
              </>
            ): (
              <>
                <Button asChild><Link href="/auth/signup">Sign Up</Link></Button>
                <Button asChild><Link href="/auth/login">Login</Link></Button>
              </>
            )}
        </div>
    </nav>
  )
}

export default Navbar