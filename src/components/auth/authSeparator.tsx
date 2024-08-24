import React from 'react'
import { Separator } from '../ui/separator'

const AuthSeparator = () => {
  return (
    <div className='flex items-center gap-x-3'>
     <Separator className='w-44'/>
     <span className='text-gray-400 text-md'>or</span>
    <Separator className='w-44'/>
    </div>
  )
}

export default AuthSeparator