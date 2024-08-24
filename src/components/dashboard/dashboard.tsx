"use client"

import React, { useEffect } from 'react'
import Navbar from '../home/navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/auth/login")
        }
    })
  return (
    <>
      <Navbar />
    </>
  )
}

export default Dashboard