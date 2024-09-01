"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import AuthSeparator from './authSeparator'
import Social from './social'
import { signinSchema } from '@/zod/signinSchema'
import login from '@/actions/login'
import CardWrapper from '../cardWrapper'

const LoginForm = () => {
   const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)


    const form = useForm<z.infer<typeof signinSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof signinSchema>) => {
        setError('')
        setSuccess('')
        setLoading(true)
       try {
        const response = await login(values)
         if(response.success) {
            setSuccess(response.success)
            router.push("/home")
         }
            if(response.error) {
                setError(response.error)
            }

            if(response.twoFactor) {
                setShowTwoFactor(true)
            }
       }  catch (error) {
            console.log(error);
            setError("Something went wrong")
       } finally {
              setLoading(false)
       }
    }
  return (
    <CardWrapper
        cardTitle={"Login"}
        cardDescription={"Login to your account"}
        cardFooter={"Don't have a account? Signup"}
        cardFooterLink={"/auth/signup"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        type="number"
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
                <>
                <FormField 
                   control={form.control}
                   name="email"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading} 
                                placeholder='Enter your email' 
                                type="email" 
                                {...field} 
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormField 
                   control={form.control}
                   name="password"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                 disabled={loading} 
                                 placeholder='******' 
                                 type="password" 
                                 {...field} 
                                 />
                        </FormControl>
                                <Link href="./auth/forgot-password" className='text-xs flex justify-end hover:underline'>Forgot Password?</Link>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                </>
                )}
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type='submit' disabled={loading} className='w-full'>{showTwoFactor ? "Confirm" : "Login"}</Button>
                <AuthSeparator />
                <Social /> 
            </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm