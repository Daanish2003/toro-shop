import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'

const AuthCard = ( {children, cardTitle, cardDescription, cardFooter, cardFooterLink}: AuthCard) => {
  return (
    <Card className='w-[450px]'>
      <CardHeader className='space-y-3 text-center'>
        <CardTitle className='font-bold text-3xl'>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button variant={"link"} asChild><Link href={cardFooterLink}>{cardFooter}</Link></Button>
      </CardFooter>
    </Card>
  )
}

export default AuthCard