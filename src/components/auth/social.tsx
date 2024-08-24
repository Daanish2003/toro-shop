import React from 'react'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

const Social = () => {

  return (
    <>
        <Button onClick={() => signIn("google")} className='w-full'>Google</Button>
    </>
  )
}

export default Social