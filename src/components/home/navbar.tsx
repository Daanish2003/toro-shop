"use client"
import React from 'react'
import { Button } from '../ui/button'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const {data: session }= useSession()
  
  const router = useRouter()
  const signUp = () => {
    router.push('/auth/signup')
  }
  return (
    <nav className="px-12 h-16 flex justify-between items-center border-b border-b-gray-500">
        <h1 className='text-2xl font-bold'>TORO-SHOP</h1>
        <div className="flex gap-x-6">
            { session && session.user ? (
               <Button variant={"outline"} size={"lg"} onClick={() => signOut()}>Logout</Button>
            ): (
              <>
                <Button variant={"outline"} size={"lg"} onClick={() => signIn()}>Login</Button>
                <Button variant={"default"} size={"lg"} onClick={() => signUp()}>Sign up</Button>
              </>
            )}
        </div>
    </nav>
  )
}

export default Navbar