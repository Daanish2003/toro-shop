"use client"

import React, { useState } from 'react'
import AuthCard from './authCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { LoginSchema } from '@/lib/zod/loginSchema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import AuthSeparator from './authSeparator'
import Social from './social'
import { signIn, useSession } from 'next-auth/react'

const LoginForm = () => {
    const {data: session} = useSession()
   const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);


    const form = useForm<z.infer<typeof LoginSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess( "");
        setLoading(true);

        const response = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        })

        if (response?.error) {
            setError(response.error);
            return;
        }

        if(response?.ok) {
            if (!session) {
                return;
            }
            router.push(`/dashboard/${session.user.id}`)
        }
    }
  return (
    <AuthCard
        cardTitle={"Login"}
        cardDescription={"Login to your account"}
        cardFooter={"Don't have a account? Signup"}
        cardFooterLink={"/auth/signup"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                                <Link href="./forgot-password" className='text-xs flex justify-end hover:underline'>Forgot Password?</Link>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type='submit' disabled={loading} className='w-full'>Submit</Button>
                <AuthSeparator />
                <Social />
            </form>
        </Form>
    </AuthCard>
  )
}

export default LoginForm